import path from 'path';
import fs from 'fs';
import parse from 'csv-parse';

import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

interface TransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class ImportTransactionsService {
  async execute(csvFilename: string): Promise<Transaction[]> {
    const csvFile = path.join(uploadConfig.directory, csvFilename);
    const createTransactionService = new CreateTransactionService();

    const transactions: TransactionDTO[] = [];
    const csvTransactions: Transaction[] = [];

    const csv = fs.createReadStream(csvFile).pipe(
      parse({
        columns: true,
        from_line: 1,
        trim: true,
      }).on('data', row => transactions.push(row)),
    );
    await new Promise(resolve => csv.on('end', resolve));

    // eslint-disable-next-line no-restricted-syntax
    for (const item of transactions) {
      const transaction = await createTransactionService.execute(item);
      csvTransactions.push(transaction);
    }

    return csvTransactions;
  }
}

export default ImportTransactionsService;
