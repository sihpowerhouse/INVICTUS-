import { MOCK_MEDIA } from '../mock/media';
import { USE_MOCK_DATA } from './api/apiClient';
import type { Media } from '../types/media';

/**
 * Service to simulate backend media operations.
 */
class MediaService {
  async getMedia(): Promise<Media[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(USE_MOCK_DATA ? [...MOCK_MEDIA] : []);
      }, 300);
    });
  }

  async getMediaById(id: string): Promise<Media | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(USE_MOCK_DATA ? MOCK_MEDIA.find((m) => m.id === id) : undefined);
      }, 250);
    });
  }
}

export const mediaService = new MediaService();

