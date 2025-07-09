import axios from 'axios';

export async function getNotifications() {
  const response = await axios.get('/api/notifications');
  return response.data;
}
