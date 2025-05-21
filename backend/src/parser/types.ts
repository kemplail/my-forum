type Operator = 'OR' | 'AND';
type AtomicConditionType = 'text' | 'exactText' | 'wildCardText' | 'exclusion';

export type LogicalCondition = {
  operator: Operator;
  conditions: (LogicalCondition | AtomicCondition)[];
};

export type AtomicCondition = {
  type: AtomicConditionType;
  value: string;
};
