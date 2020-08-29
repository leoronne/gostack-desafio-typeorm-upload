import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';

import AppError from '../errors/AppError';

const transactionsRouter = Router();

const upload = multer(uploadConfig);

transactionsRouter.get('/', async (req, res) => {
  try {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const transactions = await transactionRepository.find();
    const balance = await transactionRepository.getBalance();

    return res.json({
      transactions,
      balance,
    });
  } catch (err) {
    throw new AppError(err.message);
  }
});

transactionsRouter.post('/', async (req, res) => {
  try {
    const { title, value, type, category } = req.body;
    const createTransaction = new CreateTransactionService();
    return res.json(
      await createTransaction.execute({ title, value, type, category }),
    );
  } catch (err) {
    throw new AppError(err.message);
  }
});

transactionsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleteTransaction = new DeleteTransactionService();

    await deleteTransaction.execute(id);

    return res.status(204).send();
  } catch (err) {
    throw new AppError(err.message);
  }
});

transactionsRouter.post('/import', upload.single('file'), async (req, res) => {
  try {
    const importTransactions = new ImportTransactionsService();

    const transactions = await importTransactions.execute(req.file.path);

    return res.json(transactions);
  } catch (err) {
    throw new AppError(err.message);
  }
});

export default transactionsRouter;
