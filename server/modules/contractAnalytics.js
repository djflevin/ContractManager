// Module for contract analytics 
// I.e. how many contracts have been signed, how many are pending or other contract analytics

// Imports
// Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get overall analyitics for contracts
// Get these at a stripped down level to reduce data transfer and processing, as we only need the id and status
const contractAnalytics = async (timeFrame, programme, projectStatus) => {
  // Get all contracts that have been have a project with a start date between the start and end date
  const { studentLetters, projectDescriptions, frameworkAgreements } = await getContracts(timeFrame, programme, projectStatus)

  // Reduce contracts to only contain id and status
  const reducedStudentLetters = studentLetters.map(reduceStudentLetter)
  const reducedProjectDescriptions = projectDescriptions.map(reduceProjectDescription)
  const reducedFrameworkAgreements = frameworkAgreements.map(reduceFrameworkAgreement)

  return {
    studentLetters: reducedStudentLetters,
    projectDescriptions: reducedProjectDescriptions,
    frameworkAgreements: reducedFrameworkAgreements
  }
}

const reduceFrameworkAgreement = (frameworkAgreement) => {
  return {
    id: frameworkAgreement.id,
    status: frameworkAgreement.status,
    createdAt: frameworkAgreement.createdAt,
    sentAt: frameworkAgreement.sentAt,
    orgSigned: frameworkAgreement.orgSigned,
    uniSigned: frameworkAgreement.uniSigned,
    // +1 for each signature
    numSignatures: frameworkAgreement.orgSigned + frameworkAgreement.uniSigned
  }
}

const reduceProjectDescription = (projectDescription) => {
  return {
    id: projectDescription.id,
    status: projectDescription.status,
    createdAt: projectDescription.createdAt,
    sentAt: projectDescription.sentAt,
    orgSigned: projectDescription.orgSigned,
    uniSigned: projectDescription.uniSigned,
    programme: projectDescription.project.programme.code,
    numSignatures: projectDescription.orgSigned + projectDescription.uniSigned,
    projectStartDate: projectDescription.project.startDate,
    projectEndDate: projectDescription.project.endDate
  }
}

const reduceStudentLetter = (studentLetter) => {
  return {
    id: studentLetter.id,
    status: studentLetter.status,
    createdAt: studentLetter.createdAt,
    sentAt: studentLetter.sentAt,
    orgSigned: studentLetter.orgSigned,
    uniSigned: studentLetter.uniSigned,
    programme: studentLetter.project.programme.code,
    numSignatures: studentLetter.orgSigned + studentLetter.uniSigned,
    projectStartDate: studentLetter.project.startDate,
    projectEndDate: studentLetter.project.endDate
  }
}


const getContracts = async (timeFrame, programme, projectStatus) => {
  // Create filter object and filter by start and enddate of project start date
  // TODO: Add filter for active contracts only (i.e. not cancelled or expired) or by date 
  // Time Frame: lastYear, thisYear, nextYear, all
  // Programme: all, :programmeId
  // Project Status: all, active, inactive
  // Filters can only be applied to the project description and student letter contracts as the framework agreement is not linked to a project
  // Declare filter object with empty project and programme objects 
  const filter = {
    isArchived: false,
    project: {

    },
    
  }

  // Get start and end date of time frame
  const { startDate, endDate } = getTimeFrame(timeFrame)

  // Add start and end date to filter
  filter.project.startDate = {
    gte: startDate,
    lte: endDate
  }

  // Add programme to filter
  if (programme !== "all") {
    filter.project.programmeId = parseInt(programme)
  }
  
  // Add project status to filter
  if (projectStatus !== "all") {
    filter.project.status = projectStatus === "ACTIVE" ? "ACTIVE" : "INACTIVE"
  }

  
  // Get all contracts that have been have a project with a start date between the start and end date
  const studentLetters = await prisma.studentLetter.findMany({
    where: filter,
    include: { student: true, project : true, project: { include: { programme: true } }, template: true }, 
  })
  const projectDescriptions = await prisma.projectDescription.findMany({
    where: filter,
    include: { project: true, project: { include: { programme: true } }, template: true },
  })
  const frameworkAgreements = await prisma.framework.findMany({
    include: { organisation: true, template: true },
  })

  // Return all contracts
  return {
    studentLetters,
    projectDescriptions,
    frameworkAgreements
  }
}

// Take a String timeFrame and return the start and end date of the time frame
const getTimeFrame = (timeFrame) => {
  // Time Frames: lastYear, thisYear, nextYear, all
  // Get current date
  const currentDate = new Date()
  // Get current year
  const currentYear = currentDate.getFullYear()
  // Get current month
  const currentMonth = currentDate.getMonth()
  // Get current day
  const currentDay = currentDate.getDate()

  // Get start and end date of time frame
  let startDate
  let endDate
  switch (timeFrame) {
    case "lastYear":
      startDate = new Date(currentYear - 1, 0, 1)
      endDate = new Date(currentYear - 1, 11, 31)
      break
    case "thisYear":
      startDate = new Date(currentYear, 0, 1)
      endDate = new Date(currentYear, 11, 31)
      break
    case "nextYear":
      startDate = new Date(currentYear + 1, 0, 1)
      endDate = new Date(currentYear + 1, 11, 31)
      break
    default:
      startDate = new Date(currentYear - 1, 0, 1)
      endDate = new Date(currentYear + 1, 11, 31)
      break
  }

  return {
    startDate,
    endDate
  }
}


// Export
module.exports = {
  getContracts,
  contractAnalytics
}
