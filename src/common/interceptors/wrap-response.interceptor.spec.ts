import { WrapResponseInterceptor } from './wrap-response.interceptor';

describe('CommonInterceptor', () => {
  it('should be defined', () => {
    expect(new WrapResponseInterceptor()).toBeDefined();
  });
});
