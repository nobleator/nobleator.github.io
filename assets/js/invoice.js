async function cachedFetch(url, options = {}, ttl = 3600_000) {
  const key = `cache:${url}`;
  const cached = localStorage.getItem(key);
  const now = Date.now();

  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    if (now - timestamp < ttl) {
      return data;
    } else {
      localStorage.removeItem(key);
    }
  }

  const res = await fetch(url, options);
  const data = await res.json();
  localStorage.setItem(key, JSON.stringify({ timestamp: now, data }));
  return data;
} 
async function getTreasuryData(url) {
    const baseUrl = 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service';
    let data;
    try {
        const json = await cachedFetch(`${baseUrl}${url}`);
        data = json.data;
        if (!data.length) { alert("No data found for this year"); return; }
    } catch (e) {
        alert("Error fetching data");
        return;
    }
    return data;
}
async function getCensusData(url) {
    const baseUrl = 'https://api.census.gov/data';
    let data;
    try {
        data = await cachedFetch(`${baseUrl}${url}`);
        if (!data.length) { alert("No data found for this year"); return; }
    } catch (e) {
        alert("Error fetching data");
        return;
    }
    return data;
}
function formatCurrency(amount) {
    return `<span style="position:absolute; left:5px; top:50%; transform:translateY(-50%); font-weight:bold;">$</span><span style="display:block; text-align:right;">${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`;
}
async function generateInvoice() {
    document.getElementById("spinner").classList.remove("hidden");
    const year = document.getElementById("year").value.trim();
    const incomeTax = parseFloat(document.getElementById("income-tax").value.trim());

    if (!year || isNaN(incomeTax)) {
        alert("Please enter a valid year and income tax amount.");
        return;
    }

    const incomeTaxRevenueUrl = `/v1/accounting/od/net_position?fields=consolidated_bil_amt&filter=stmt_fiscal_year:eq:${year},account_desc:eq:Revenue,line_item_desc:eq:Individual income tax and tax withholdings,restmt_flag:eq:Y`;
    const totalTaxRevenueUrl = `/v1/accounting/od/net_position?fields=consolidated_bil_amt&filter=stmt_fiscal_year:eq:${year},account_desc:eq:Revenue,line_item_desc:eq:Total revenue,restmt_flag:eq:Y`;
    const expenseDataUrl = `/v2/accounting/od/statement_net_cost?fields=agency_nm,net_cost_bil_amt&filter=stmt_fiscal_year:eq:${year},restmt_flag:eq:Y`;
    const debtUrl = `/v2/accounting/od/debt_to_penny?filter=record_calendar_year:eq:${year},record_calendar_month:eq:01&fields=record_date,tot_pub_debt_out_amt&sort=record_date&page[number]=1&page[size]=1`;
    const popUrl = `/2023/pep/charv?get=POP,YEAR,MONTH&for=us:1&YEAR=${year}`;

    const incomeTaxRevenueData = await getTreasuryData(incomeTaxRevenueUrl);
    const incomeTaxRevenue = parseFloat(incomeTaxRevenueData[0].consolidated_bil_amt) * 1_000_000_000;
    const totalTaxRevenueData = await getTreasuryData(totalTaxRevenueUrl);
    const totalTaxRevenue = parseFloat(totalTaxRevenueData[0].consolidated_bil_amt) * 1_000_000_000;
    const nonIncomeTaxRevenue = totalTaxRevenue - incomeTaxRevenue;
    const debtData = await getTreasuryData(debtUrl);
    const startingDebt = parseFloat(debtData[0].tot_pub_debt_out_amt);
    const popData = await getCensusData(popUrl);
    const [popDataHdr, ...popDataRows] = popData;
    const monthIndex = popDataHdr.indexOf("MONTH");
    const popIndex = popDataHdr.indexOf("POP");
    const maxMonthRow = popDataRows.reduce((maxRow, currentRow) => {
    return parseInt(currentRow[monthIndex], 10) > parseInt(maxRow[monthIndex], 10)
        ? currentRow
        : maxRow;
    });
    const population = parseFloat(maxMonthRow[popIndex]);
    const debtPerCapita = startingDebt / population;

    const expenses = await getTreasuryData(expenseDataUrl);
    const totalExpenses = expenses.filter(x => x.agency_nm === 'Total')[0].net_cost_bil_amt * 1_000_000_000;
    const funded = totalTaxRevenue / totalExpenses;
    const debt = 1 - funded;
    
    const personalIndividualIncomeTaxProportion = incomeTax / incomeTaxRevenue;
    const individualIncomeTaxProportion = incomeTaxRevenue / totalTaxRevenue * funded;

    let totalAmountDue = 0;
    let totalAmountPaid = 0;
    let totalBalance = debtPerCapita;

    const rows = expenses
        .filter(x => x.agency_nm !== 'Total')
        .map(expense => {
            const expenseAmount = parseFloat(expense.net_cost_bil_amt) * 1_000_000_000;
            const amountDue = personalIndividualIncomeTaxProportion * expenseAmount;
            const amountPaid = personalIndividualIncomeTaxProportion * individualIncomeTaxProportion * expenseAmount;
            const balance = debt * expenseAmount / population;

            totalAmountDue += amountDue;
            totalAmountPaid += amountPaid;
            totalBalance += balance;

            return `<tr>
            <td>${expense.agency_nm}</td>
            <td style="position:relative; padding-left:15px;">${formatCurrency(amountDue)}</td>
            <td style="position:relative; padding-left:15px;">${formatCurrency(amountPaid)}</td>
            <td style="position:relative; padding-left:15px;">${formatCurrency(totalBalance)}</td>
            </tr>`;
        });

    const formattedTable = `
    <table class="invoice-table">
        <thead>
        <tr>
            <th>Line Item</th>
            <th>Amount Due</th>
            <th>Amount Paid</th>
            <th>Balance</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Starting Balance</td>
            <td>-</td>
            <td>-</td>
            <td style="position:relative; padding-left:15px;">${formatCurrency(debtPerCapita)}</td>
        </tr>
        ${rows.join('')}
        </tbody>
        <tfoot>
        <tr style="font-weight: bold;">
            <td>Total</td>
            <td style="position:relative; padding-left:15px;">${formatCurrency(totalAmountDue)}</td>
            <td style="position:relative; padding-left:15px;">${formatCurrency(totalAmountPaid)}</td>
            <td style="position:relative; padding-left:15px;">${formatCurrency(totalBalance)}</td>
        </tr>
        </tfoot>
    </table>`;

    const invoiceHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Invoice ${year}</title>
    <link rel="stylesheet" href="/css/invoice.css">
    </head>
    <body>
    <div class="invoice">
        <div class="header">
        <h1>Invoice</h1>
        <div>
            <p><strong>Year:</strong> ${year}</p>
        </div>
        </div>
        <div class="from-to">
        <div>
            <p><strong>From:</strong></p>
            <p>Representative Scrooge McDuck: (123) 456-7890</p>
            <p>Senator Wile E. Coyote: (123) 456-7890</p>
            <p>Senator Vladimir Harkonnen: (123) 456-7890</p>
            <p>First St SE, Washington, DC 20004, United States</p>
        </div>
        <div>
            <p><strong>To:</strong></p>
            <p>J. Doe</p>
            <p>Anytown, USA</p>
        </div>
        </div>
        ${formattedTable}
    </div>
    </body>
    </html>
    `;

    const newWin = window.open("", "_blank");
    newWin.document.open();
    newWin.document.write(invoiceHtml);
    newWin.document.close();

    document.getElementById("spinner").classList.add("hidden");
}