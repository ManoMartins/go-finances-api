import { getCustomRepository, getRepository } from 'typeorm';
// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // TODO
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const checkCategoryExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!checkCategoryExists) {
      const categoryCreate = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(categoryCreate);
    }

    const checkCategoryId = await categoriesRepository.findOne({
      where: { title: category },
    });

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: checkCategoryId?.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
