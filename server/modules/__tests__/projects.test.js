const {
    handleProjectUpload,
    createIfNotExistsOrganisation,
    createIfNotExistsStudent,
    createIfNotExistsProject,
    createIfNotExistsFramework,
    createIfNotExistsProgramme
} = require('../projects');
const { PrismaClient } = require('@prisma/client');


// Create a mock prisma client to mock the database calls
jest.mock('@prisma/client', () => {
    const originalModule = jest.requireActual('@prisma/client');

    const prismaClientMock = {
        student: {
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        organisation: {
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        project: {
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        programme: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        frameworkTemplate: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        framework: {
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        studentLetterTemplate: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        studentLetter: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        projectDescriptionTemplate: {
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        projectDescription: {
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };

    return {
        ...originalModule,
        PrismaClient: jest.fn(() => prismaClientMock),
    };
});

const data = {
    employment: "Non",
    end_date: "09/09/2023",
    is_email: "mike.bruen@whimsical-councilman.info",
    is_name: "Bruce Zulauf",
    is_position: "",
    location: "England",
    module_code: "ML_46",
    module_year: "3",
    org_jurisdiction: "England",
    org_notices_email: "mike.bruen@whimsical-councilman.info",
    org_notices_name: "test name 1",
    org_signatory_email: "anotheremail@company.com",
    org_signatory_name: "Joe Carter",
    org_signatory_position: "",
    organisation: "Apple",
    project_description: "Ducimus soluta quaerat mollitia quod perspiciatis alias quod odio est. Aspernatur maxime perspiciatis ratione officiis. Nostrum numquam corporis aut. Eaque ut libero iusto perferendis modi.",
    project_title: "p2p network for phone transactions",
    start_date: "02/05/2022",
    student_email: "student2@ucl.com",
    student_first_name: "Uzair",
    student_id: "12312",
    student_name: "MUI",
    student_reference: "",
    university_program: "COMP_22",
    university_reference: "",
    university_signatory_email: "s.hailes@ucl.ac.uk",
    university_signatory_name: "Professor Stephen Hailes",
    university_signatory_position: "Head of Department, Computer Science",
    university_supervisor: "Dr Percy Schoen DVM",
    university_supervisor_email: "ronnie.kulas.dvm@ucl.ac.uk"
}

// Unit tests for the handleProjectUpload function
describe('Create Programmes', () => {

    test('Create a new programme', async () => {
        const prisma = new PrismaClient();
        const result = await createIfNotExistsProgramme(data);

        expect(prisma.programme.create).toHaveBeenCalled();
        expect(result.programmeCreated).toBe(true);
    });

});

