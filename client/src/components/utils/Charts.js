// Chart Utils

// Format Chart Data

const formatContractPieChart = (data) => {
  // Getting Pie Chart data of status for any contract type
  const labels = ["Draft", "Sent", "Signed"]
  const total = data.length
  const pieSeries = [0, 0, 0]

  data.forEach((contract) => {
    if (contract.status === "DRAFT") {
      pieSeries[0] += 1
    } else if (contract.status === "SENT") {
      pieSeries[1] += 1
    } else if (contract.status === "SIGNED") {
      pieSeries[2] += 1
    }
  })
  return {
    labels: labels,
    series: pieSeries,
    total: total
  }
}

const formatProgrammeContractBarChart = (data) => {
  // Get a breakdown of signatures per Module
  const total = data.length
  const series = [
    {
      name: "Draft",
      data: []
    },
    {
      name: "Sent",
      data: []
    },
    {
      name: "Signed",
      data: []
    }
  ]
  const categories = []
  // Firs we need to get the categories and the series
  data.forEach((contract) => {
    const programme = contract.programme
    if (!categories.includes(programme)) {
      categories.push(programme)
      series.forEach((serie) => {
        serie.data.push(0)
      })
    }

    const programmeIndex = categories.indexOf(programme)
    if (contract.status === "DRAFT") {
      series[0].data[programmeIndex] += 1
    } else if (contract.status === "SENT") {
      series[1].data[programmeIndex] += 1
    } else if (contract.status === "SIGNED") {
      series[2].data[programmeIndex] += 1
    }
  })

  return {
    categories: categories,
    series: series,
    total: total
  }

}



export { formatContractPieChart, formatProgrammeContractBarChart }


