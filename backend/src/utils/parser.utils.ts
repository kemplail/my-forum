import {
  AtomicCondition,
  AtomicConditionType,
  LogicalCondition,
  LogicalOperator,
} from 'src/parser/types';

const path = 'text';

type PathQuery = {
  path: string;
  query: string;
};

type TextOperator = { text: PathQuery };
type PhraseOperator = { phrase: PathQuery & { slop?: number } };

type ExclusionOperator = SinglePreciseCompound<'mustNot', TextOperator>;
type AtomicOperator = TextOperator | PhraseOperator;

type MongoSearchOperatorMap = Record<
  AtomicConditionType,
  (value: string) => AtomicOperator | ExclusionOperator
>;

export type CompoundOperatorName = 'should' | 'filter' | 'mustNot' | 'must';

const example: Compound = {
  compound: {
    filter: [
      {
        compound: {
          should: [
            {
              compound: {
                should: [
                  {
                    text: {
                      path: 'text',
                      query: 'test',
                    },
                  },
                  {
                    text: {
                      path: 'text',
                      query: 'test',
                    },
                  },
                ],
              },
            },
            {
              compound: {
                filter: [
                  {
                    text: {
                      path: 'text',
                      query: 'test',
                    },
                  },
                  {
                    text: {
                      path: 'text',
                      query: 'test',
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        compound: {
          mustNot: [
            {
              text: {
                path: 'text',
                query: 'test',
              },
            },
          ],
        },
      },
    ],
  },
};

// Permet d'avoir :
// {
//   compound: {
//     should: [...]
//   }
// }
// OU
// {
//   compound: {
//     filter: [...]
//   }
// }
// ...
type SingleCompound<Op extends CompoundOperatorName> = {
  compound: {
    [key in Op]: (AtomicOperator | Compound)[];
  } & {
    [key in Exclude<CompoundOperatorName, Op>]?: never;
  };
};

type SinglePreciseCompound<
  Op extends CompoundOperatorName,
  Elem extends AtomicOperator,
> = {
  compound: {
    [key in Op]: [Elem];
  } & {
    [key in Exclude<CompoundOperatorName, Op>]?: never;
  };
};

export type Compound =
  | SingleCompound<'filter'>
  | SingleCompound<'should'>
  | SingleCompound<'mustNot'>
  | SingleCompound<'must'>;

// Retire les '*' et les espaces inutiles
const sanitizeQuery = (value: string) =>
  value.replace(/\*/g, '').replace(/\s+/g, ' ').trim();

// Map permettant de transformer une condition obtenue après le parsing en operateur mongo
// Exemple : wildCardText devient un operateur phrase avec un slop à 3
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
}): Compound {
  // Transforme les conditions :
  // si la condition est atomique (pas d'imbrication) => on la transforme en opérateur mongo
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

  // Détermine l'opérateur de compound à utiliser
  const operatorKey: CompoundOperatorName =
    operatorToApply === 'AND' ? 'filter' : 'should';

  const compound = {
    compound: {
      [operatorKey]: transformedConditions,
    },
  } as Compound;

  // On encapsule un should avec un filter uniquement si ce should est au premier niveau,
  // sinon le should est déjà imbriqué dans un filter plus haut dans l'arborescence
  if (isTopLevel && operatorKey === 'should') {
    return {
      compound: {
        filter: [compound],
      },
    };
  }

  return compound;
}
