const { userValidationRules, validate } = require('./user');
const { validationResult } = require('express-validator');

describe('userValidationRules', () => {
  it('should pass validation for a valid user', async () => {
    const req = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
    };
    const validationRules = userValidationRules();
    for (const rule of validationRules) {
      await rule(req, {}, () => {});
    }

    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
  });

  it('should fail validation for an empty first name', async () => {
    const req = {
      body: {
        firstName: '',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
    };

    const validationRules = userValidationRules();
    for (const rule of validationRules) {
      await rule(req, {}, () => {});
    }
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()).toHaveLength(2);
    expect(errors.array()[0].msg).toBe('Enter your first name');
  });

  it('should fail validation for an invalid email address', async () => {
    const req = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
      },
    };

    const validationRules = userValidationRules();
    for (const rule of validationRules) {
      await rule(req, {}, () => {});
    }
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()).toHaveLength(1);
    expect(errors.array()[0].msg).toBe('Enter Valid email address');
  });

  it('should fail validation for an empty last name', async () => {
    const req = {
      body: {
        firstName: 'John',
        lastName: '',
        email: 'john.doe@example.com',
      },
    };

    const validationRules = userValidationRules();
    for (const rule of validationRules) {
      await rule(req, {}, () => {});
    }
    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(false);
    expect(errors.array()).toHaveLength(2);
    expect(errors.array()[0].msg).toBe('Enter your last name');
  });
});