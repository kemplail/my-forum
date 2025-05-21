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
type ExclusionOperator = {
  compound: {
    mustNot: TextOperator;
  };
};

type MongoSearchOperator = TextOperator | PhraseOperator | ExclusionOperator;

type MongoSearchOperatorMap = Record<
  AtomicConditionType,
  (value: string) => MongoSearchOperator
>;

export type CompoundBasicOperator = 'must' | 'should';

// Permet d'avoir :
// {
//   should: [...]
// }
// OU (mais pas les 2)
// {
//   mustl: [...]
// }
type CompoundClause<operator extends CompoundBasicOperator> = {
  [key in operator]: (MongoSearchOperator | MongoSearchQuery)[];
} & {
  [otherKey in Exclude<CompoundBasicOperator, operator>]?: never;
};

type MongoSearchQuery = CompoundClause<'must'> | CompoundClause<'should'>;

// Exemple : (roulement sphérique "presse hydraulique" OR "obus * explosif" industrie) -artillerie
const example: MongoSearchQuery = {
  must: [
    {
      should: [
        {
          must: [
            {
              text: {
                path: 'text',
                query: 'roulement',
              },
            },
            {
              text: {
                path: 'text',
                query: 'sphérique',
              },
            },
            {
              phrase: {
                path: 'text',
                query: 'presse hydraulique',
              },
            },
          ],
        },
        {
          must: [
            {
              phrase: {
                path: 'text',
                slop: 3,
                query: 'obus explosif',
              },
            },
            {
              text: {
                path: 'text',
                query: 'industrie',
              },
            },
          ],
        },
      ],
    },
    {
      compound: {
        mustNot: {
          text: {
            path: 'text',
            query: 'artillerie',
          },
        },
      },
    },
  ],
};

const sanitizeQuery = (value: string) =>
  value.replace(/\*/g, '').replace(/\s+/g, ' ').trim();

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
      mustNot: {
        text: {
          path,
          query: value,
        },
      },
    },
  }),
};

export function transformParsedQueryToMongoQuery({
  conditions,
  operatorToApply = 'AND',
}: {
  conditions: (LogicalCondition | AtomicCondition)[];
  operatorToApply?: LogicalOperator;
}) {
  let compound = {};
  const operatorKey: CompoundBasicOperator =
    operatorToApply === 'AND' ? 'must' : 'should';

  for (const condition of conditions) {
    const entry =
      'value' in condition
        ? mongoSearchOperatorMap[condition.type](condition.value)
        : transformParsedQueryToMongoQuery({
            conditions: condition.conditions,
            operatorToApply: condition.operator,
          });

    compound = {
      ...compound,
      [operatorKey]: [...(compound[operatorKey] ?? []), entry],
    };
  }

  return compound;
}
