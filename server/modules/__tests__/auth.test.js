// Import the checkUserInDB function
const axios = require('axios');
const jwt = require('jsonwebtoken');

const {
    checkUserInDB,
    handleLogin,
    createToken,
    verifyToken,
    authenticateToken,
    authenticateAdminRole,
    ensureStaff,
} = require('../auth.js');

const { PrismaClient, UserRole } = require('@prisma/client');

// Create a mock prisma client to mock the database calls
jest.mock('@prisma/client', () => {
    const originalModule = jest.requireActual('@prisma/client');

    const prismaClientMock = {
        user: {
            upsert: jest.fn(),
        },
    };

    return {
        ...originalModule,
        PrismaClient: jest.fn(() => prismaClientMock),
    };
});

jest.mock('axios');

// Clear the mock prisma client after each test
afterEach(() => {
    jest.clearAllMocks();
});

// Test Auth Module
describe('Auth Module', () => {
    describe('checkUserInDB', () => {

        test('should create a new user with the default role', async () => {
            // Create a mock user data object
            const userData = {
                upi: 'test.user.22@ucl.ac.uk',
                mail: 'test.user.22@ucl.ac.uk',
                full_name: 'Test User',
            };

            // Create the mock prisma client 
            const prisma = new PrismaClient();
            // Mock the upsert function to return a user object with the default role
            prisma.user.upsert.mockResolvedValue({
                id: userData.upi,
                email: userData.mail,
                fullName: userData.full_name,
                role: UserRole.USER,
            });

            // Call the function to test and await the result
            const result = await checkUserInDB(userData);

            expect(prisma.user.upsert).toHaveBeenCalled();
            expect(result.role).toBe(UserRole.USER);
        });

        test('should create a new admin user', async () => {
            const userData = {
                upi: 'daniel.levin.22@ucl.ac.uk',
                mail: 'daniel.levin.22@ucl.ac.uk',
                full_name: 'Daniel Levin',
            };

            const prisma = new PrismaClient();
            prisma.user.upsert.mockResolvedValue({
                id: userData.upi,
                email: userData.mail,
                fullName: userData.full_name,
                role: UserRole.ADMIN,
            });

            const result = await checkUserInDB(userData);

            expect(prisma.user.upsert).toHaveBeenCalled();
            expect(result.role).toBe(UserRole.ADMIN);
        });

        test('should ensure that only staff can login', async () => {
            const userData = {
                upi: 'dominic.kloecker.22@ucl.ac.uk',
                mail: 'dominic.kloecker.22@ucl.ac.uk',
                full_name: 'Dominic Kloecker',
                is_staff: false,
            };

            let isStaff = await ensureStaff(userData);
            expect(isStaff).toBe(false);
        });

        test('Should return null on invalid code', async () => {
            // Mock the Axios error response for getUCLToken as a 400 error
            axios.post.mockRejectedValue({
                response: {
                    status: 400,
                    data: { error: 'invalid_request' },
                },
            });
            const code = 'invalid_code';
            const result = await handleLogin(code);
            expect(result).toBe(null);
        });
    });

    describe('createToken', () => {
        test('Should create a token and verify it', () => {
            const user = {
                id: 'dominic.kloecker.22@ucl.ac.uk',
                email: 'dominic.kloecker.22@ucl.ac.uk',
                fullName: 'Dominic Kloecker',
                role: UserRole.USER,
            };

            const token = createToken(user);
            expect(token).not.toBe(null);

            const decoded = verifyToken(token);
            expect(decoded).not.toBe(null);

            expect(decoded.user_data.id).toBe(user.id);
            expect(decoded.user_data.email).toBe(user.email);
            expect(decoded.user_data.fullName).toBe(user.fullName);
            expect(decoded.user_data.role).toBe(user.role);
            expect(decoded.exp).not.toBe(null);
        });
    });

    describe('authenticateToken', () => {
        let req, res, next;

        // Create a mock request, response and next function before each test case 
        beforeEach(() => {
            req = {
                method: 'GET',
                headers: {},
            };
            res = {
                sendStatus: jest.fn(),
            };
            next = jest.fn();
        });

        test('Should call next() for OPTIONS request', async () => {
            req.method = 'OPTIONS';
            await authenticateToken(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        test('Should return 401 if token is not provided', async () => {
            await authenticateToken(req, res, next);
            expect(res.sendStatus).toHaveBeenCalledWith(401);
        });

        test('Should return 401 if token is expired', async () => {
            const expiredToken = jwt.sign({ exp: Math.floor(Date.now() / 1000) - 60 }, 'test_secret');
            // Set the authorization header to the expired token 
            req.headers.authorization = `Bearer ${expiredToken}`;
            await authenticateToken(req, res, next);
            expect(res.sendStatus).toHaveBeenCalledWith(401);
        });

        test('Should return 403 if token is invalid', async () => {
            const user_data = {
                upi: 'dominic.kloecker.22@ucl.ac.uk',
                mail: 'dominic.kloecker.22@ucl.ac.uk',
                full_name: 'Dominic Kloecker',
                is_staff: false,
            };
            const invalidToken = jwt.sign({ user_data }, 'wrong_secret');
            // Set the authorization header to the invalid token
            req.headers.authorization = `Bearer ${invalidToken}`;
            await authenticateToken(req, res, next);
            expect(res.sendStatus).toHaveBeenCalledWith(403);
        });

        test('Should call next() if token is valid', async () => {
            const user_data = {
                upi: 'dominic.kloecker.22@ucl.ac.uk',
                mail: 'dominic.kloecker.22@ucl.ac.uk',
                full_name: 'Dominic Kloecker',
                is_staff: false,
            };
            const validToken = createToken(user_data);
            req.headers.authorization = `Bearer ${validToken}`;
            await authenticateToken(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });

    describe('authenticateRole', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                method: 'GET',
                headers: {},
            };
            res = {
                sendStatus: jest.fn(),
            };
            next = jest.fn();
        });

        test('Should call next() for OPTIONS request', async () => {
            req.method = 'OPTIONS';
            await authenticateAdminRole(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        test('Should return 401 if token is not provided', async () => {
            await authenticateAdminRole(req, res, next);
            expect(res.sendStatus).toHaveBeenCalledWith(401);
        });

        test('Should return 401 if token is expired', async () => {
            const expiredToken = jwt.sign({ exp: Math.floor(Date.now() / 1000) - 60 }, 'test_secret');
            req.headers.authorization = `Bearer ${expiredToken}`;
            await authenticateAdminRole(req, res, next);
            expect(res.sendStatus).toHaveBeenCalledWith(401);
        });

        test('Should return 403 if user is not an admin', async () => {
            const user_data = {
                upi: 'dominic.kloecker.22@ucl.ac.uk',
                mail: 'dominic.kloecker.22@ucl.ac.uk',
                full_name: 'Dominic Kloecker',
                role: UserRole.USER,
            };
            const validToken = createToken(user_data);
            req.headers.authorization = `Bearer ${validToken}`;
            await authenticateAdminRole(req, res, next);
            expect(res.sendStatus).toHaveBeenCalledWith(403);
        });

        test('Should call next() if user is an admin', async () => {
            const user_data = {
                upi: 'dominic.kloecker.22@ucl.ac.uk',
                mail: 'dominic.kloecker.22@ucl.ac.uk',
                full_name: 'Dominic Kloecker',
                role: UserRole.ADMIN,
            };
            const validToken = createToken(user_data);
            req.headers.authorization = `Bearer ${validToken}`;
            await authenticateAdminRole(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
});
