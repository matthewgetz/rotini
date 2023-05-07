import { stringSimilarity, } from './comparisons';

describe('comparisons', () => {
  describe('stringSimilarity', () => {
    it('is 100% match', () => {
      const result = stringSimilarity('this is a string', 'this is a string');
      expect(result).toBe(1);
    });

    it('is 100% match', () => {
      const result = stringSimilarity('', '');
      expect(result).toBe(1);
    });

    it('is 75% match', () => {
      const result = stringSimilarity('four', 'fou');
      expect(result).toBe(0.75);
    });

    it('is 75% match', () => {
      const result = stringSimilarity('fou', 'four');
      expect(result).toBe(0.75);
    });

    it('is 50% match', () => {
      const result = stringSimilarity('four', 'fr');
      expect(result).toBe(0.5);
    });

    it('is 50% match', () => {
      const result = stringSimilarity('fr', 'four');
      expect(result).toBe(0.5);
    });

    it('is 25% match', () => {
      const result = stringSimilarity('four', 'fro');
      expect(result).toBe(0.25);
    });

    it('is 25% match', () => {
      const result = stringSimilarity('fro', 'four');
      expect(result).toBe(0.25);
    });

    it('is 0% match', () => {
      const result = stringSimilarity('four', '');
      expect(result).toBe(0);
    });

    it('is 0% match', () => {
      const result = stringSimilarity('', 'four');
      expect(result).toBe(0);
    });
  });
});
