import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    try {
      const transactionRepository = getCustomRepository(TransactionsRepository);

      const transaction = await transactionRepository.findOne(id);

      if (!transaction) throw new AppError('Transaction not found', 404);

      await transactionRepository.remove(transaction);

      return;
    } catch (err) {
      throw new AppError(err.message, 500);
    }
  }
}

export default DeleteTransactionService;
