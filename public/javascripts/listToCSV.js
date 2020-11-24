const downloadLink = document.getElementById('downloadCSV')

const headers = document.querySelectorAll('#thComponent, #thSelection, #thPrice');

const trs = document.querySelectorAll('tbody tr');
const totalPrice = document.querySelector('.totalVal');
let csvString = ''
headers.forEach((header, i) => {
  i == headers.length-1 ?  csvString+=header.textContent + '\n' : csvString+=header.textContent + ','
})
trs.forEach(row => {
    const rowContent = row.querySelectorAll('.csv-content')
    rowContent.forEach((rowData,i) => {
        i == rowContent.length - 1 ? csvString += rowData.textContent + '\n' : csvString += rowData.textContent + ',';
    })
})
csvString += 'Total:,,' + totalPrice.textContent
downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvString));
downloadLink.setAttribute('download', 'MY_LIST-PC_PART_PLANNER.csv');