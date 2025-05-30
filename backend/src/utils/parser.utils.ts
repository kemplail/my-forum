import {
  AtomicCondition,
  LogicalCondition,
  LogicalOperator,
} from 'src/parser/types';

const path = 'text';

type BaseOperator = {
  path: string;
  query: string;
};

type TextOperator = { text: BaseOperator };
type PhraseOperator = { phrase: BaseOperator & { slop?: number } };

type AtomicOperator = TextOperator | PhraseOperator;

export type CompoundClause = 'should' | 'filter' | 'mustNot' | 'must';

// CompoundOperation avec possibilité de lui donner une clause précise (must | mustNot | should | filter)
type SingleCompoundOperation<OpName extends CompoundClause> = {
  compound: {
    [key in OpName]: (AtomicOperator | CompoundOperation)[];
  } & {
    [key in Exclude<CompoundClause, OpName>]?: never;
  };
};

export type CompoundOperation =
  | SingleCompoundOperation<'filter'>
  | SingleCompoundOperation<'should'>
  | SingleCompoundOperation<'mustNot'>
  | SingleCompoundOperation<'must'>;

// Retire les '*' et les espaces inutiles
const sanitizeQuery = (value: string) =>
  value.replace(/\*/g, '').replace(/\s+/g, ' ').trim();

// Map permettant de transformer une condition atomique obtenue après le parsing en operateur mongo
// Exemple : wildCardText devient un operateur phrase avec un slop à 3
type MongoSimpleConditionMap = {
  text: (value: string) => TextOperator;
  exactText: (value: string) => PhraseOperator;
  wildCardText: (value: string) => PhraseOperator;
};

export const mongoSimpleConditionMap: MongoSimpleConditionMap = {
  text: (value) => ({
    text: {
      path,
      query: value,
    },
  }),
  exactText: (value) => ({
    phrase: {
      path,
      query: value,
    },
  }),
  wildCardText: (value) => ({
    phrase: {
      path,
      slop: 3,
      query: sanitizeQuery(value),
    },
  }),
};

const logicalOperatorMap: Record<LogicalOperator, CompoundClause> = {
  AND: 'filter',
  OR: 'should',
  NOT: 'mustNot',
};

export function transformParsedQueryToMongoQuery({
  conditions,
  operatorToApply = 'AND',
  isTopLevel = true,
}: {
  conditions: (LogicalCondition | AtomicCondition)[];
  operatorToApply?: LogicalOperator;
  isTopLevel?: boolean;
}): CompoundOperation {
  // Transforme les conditions :
  // si la condition est atomique (pas d'imbrication) => on la transforme en opérateur mongo via la mongoSearchOperatorMap
  // sinon (la condition a des imbrications) => on appelle récursivement la fonction sur ses conditions imbriquées
  const transformedConditions = conditions.map((condition) => {
    if ('value' in condition) {
      return mongoSimpleConditionMap[condition.type](condition.value);
    } else {
      return transformParsedQueryToMongoQuery({
        conditions: condition.conditions,
        operatorToApply: condition.operator,
        isTopLevel: false,
      });
    }
  });

  // Détermine la clause de compound à utiliser
  const compoundClause: CompoundClause = logicalOperatorMap[operatorToApply];

  const compound = {
    compound: {
      [compoundClause]: transformedConditions,
    },
  } as CompoundOperation;

  // On encapsule un should avec un filter uniquement si ce should est au premier niveau,
  // sinon le should est déjà imbriqué dans un filter plus haut dans l'arborescence
  if (isTopLevel && compoundClause === 'should') {
    return {
      compound: {
        filter: [compound],
      },
    };
  }

  return compound;
}
