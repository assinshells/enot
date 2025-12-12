import request from '../utils/request';

/**
 * API для работы с пользователем
 */

// Получить профиль
export const getProfile = async () => {
  return request.get('/users/profile');
};