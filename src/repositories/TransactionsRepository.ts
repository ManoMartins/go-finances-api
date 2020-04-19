import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
    const income = (await this.find())
      .filter(transaction => transaction.type === 'income')
      .reduce((total, currentValue) => total + currentValue.value, 0);

    const outcome = (await this.find())
      .filter(transaction => transaction.type === 'outcome')
      .reduce((total, currentValue) => total + currentValue.value, 0);

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
