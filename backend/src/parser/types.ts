export type LogicalOperator = 'AND' | 'OR';

export type SimpleConditionType = 'text' | 'exactText' | 'wildCardText';
export type SimpleCondition<
  T extends SimpleConditionType = SimpleConditionType,
> = {
  type: T;
  value: string;
};

export type ExclusionCondition = {
  type: 'exclusion';
  value: SimpleCondition<SimpleConditionType>;
};

export type AtomicCondition = SimpleCondition | ExclusionCondition;

export type LogicalCondition = {
  operator: LogicalOperator;
  conditions: (LogicalCondition | AtomicCondition)[];
};
