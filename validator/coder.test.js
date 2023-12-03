const { coderValidationRules } = require('./coder');
const { validationResult } = require('express-validator');

describe('coderValidationRules', () => {
  it('should pass validation for a valid phone number', async () => {
    const req = {
      body: {
        phoneNumber: '123456789', // Valid phone number without zero
      },
    };
    const validationRules = coderValidationRules();
    for (const rule of validationRules) {
      await rule(req, {}, () => {});
    }

    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });

  it('should fail validation for an empty phone number', async () => {
    const req = {
      body: {
        phoneNumber: '', // Empty phone number
      },
    };

    const validationRules = coderValidationRules();
    for (const rule of validationRules) {
      await rule(req, {}, () => {});
    }
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()).toHaveLength(2);
    expect(errors.array()[0].msg).toBe('Enter your phone Number without zero');
  });

  it('should fail validation for a phone number with length other than 9', async() => {
    const req = {
      body: {
        phoneNumber: '1234567890', // Phone number with length other than 9
      },
    };

    const validationRules = coderValidationRules();
    for (const rule of validationRules) {
      await rule(req, {}, () => {});
    }

    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()).toHaveLength(1);
    expect(errors.array()[0].msg).toBe('Only finnish phone number is allowed');
  });
});