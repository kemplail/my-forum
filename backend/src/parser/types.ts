export type LogicalOperator = 'OR' | 'AND';

export type AtomicConditionType =
  | 'text'
  | 'exactText'
  | 'wildCardText'
  | 'exclusion';

export type LogicalCondition = {
  operator: LogicalOperator;
  conditions: (LogicalCondition | AtomicCondition)[];
};

export type AtomicCondition = {
  type: AtomicConditionType;
  value: string;
};
