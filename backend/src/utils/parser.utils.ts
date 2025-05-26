import {
  AtomicCondition,
  AtomicConditionType,
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

type ExclusionOperator = SinglePreciseCompoundOperation<
  'mustNot',
  TextOperator
>;
type AtomicOperator = TextOperator | PhraseOperator;

export type CompoundClause = 'should' | 'filter' | 'mustNot' | 'must';

// CompoundOperation avec une clause précise (must | mustNot | should | filter)
type SingleCompoundOperation<OpName extends CompoundClause> = {
  compound: {
    [key in OpName]: (AtomicOperator | CompoundOperation)[];
  } & {
    [key in Exclude<CompoundClause, OpName>]?: never;
  };
};

// SingleCompoundOperation qui possède un seul opérateur précis
type SinglePreciseCompoundOperation<
  Clause extends CompoundClause,
  Op extends AtomicOperator,
> = {
  compound: {
    [key in Clause]: [Op];
  } & {
    [key in Exclude<CompoundClause, Clause>]?: never;
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

// Map permettant de transformer une condition obtenue après le parsing en operateur mongo
// Exemple : wildCardText devient un operateur phrase avec un slop à 3
type MongoSearchOperatorMap = Record<
  AtomicConditionType,
  (value: string) => AtomicOperator | ExclusionOperator
>;

export const mongoSearchOperatorMap: MongoSearchOperatorMap = {
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
  exclusion: (value) => ({
    compound: {
      mustNot: [
        {
          text: {
            path,
            query: value,
          },
        },
      ],
    },
  }),
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
  const transformedConditions = conditions.map((condition) =>
    'value' in condition
      ? mongoSearchOperatorMap[condition.type](condition.value)
      : transformParsedQueryToMongoQuery({
          conditions: condition.conditions,
          operatorToApply: condition.operator,
          isTopLevel: false,
        }),
  );

  // Détermine la clause de compound à utiliser
  const compoundClause: CompoundClause =
    operatorToApply === 'AND' ? 'filter' : 'should';

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
