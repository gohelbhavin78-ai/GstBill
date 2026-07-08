/**
 * BG Invoice Pro - Intracommunity and Interstate Automated GST Computation Engine
 */

const GstEngine = {
    calculateRow(qty, rate, discountPercentage, gstPercentage) {
        const baseGross = qty * rate;
        const discAmount = baseGross * (discountPercentage / 100);
        const taxableVal = baseGross - discAmount;
        const taxAmount = taxableVal * (gstPercentage / 100);
        
        return {
            taxable: taxableVal,
            gstAmount: taxAmount,
            grossTotal: taxableVal + taxAmount
        };
    },

    evaluateTaxDistribution(taxableAmount, gstPercentage, sourceState, destState) {
        const distribution = { cgst: 0, sgst: 0, igst: 0 };
        const totalTax = taxableAmount * (gstPercentage / 100);

        if (!sourceState || !destState) return distribution;

        // Route tax based on location: Intra-state vs Inter-state matching rule
        if (sourceState.trim().toLowerCase() === destState.trim().toLowerCase()) {
            distribution.cgst = totalTax / 2;
            distribution.sgst = totalTax / 2;
        } else {
            distribution.igst = totalTax;
        }
        return distribution;
    },

    convertNumberToWords(amount) {
        // High-fidelity standard monetary conversion mapping engine string utility
        let fraction = Math.round((amount - Math.floor(amount)) * 100);
        let fractionStr = fraction > 0 ? ` and ${fraction}/100 Paise Only` : " Only";
        
        let words = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", 
                     "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        let tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
        
        function convertLessThanOneThousand(number) {
            let remainder = number % 100;
            let str = "";
            if (number >= 100) {
                str += words[Math.floor(number / 100)] + " Hundred ";
            }
            if (remainder < 20) {
                str += words[remainder];
            } else {
                str += tens[Math.floor(remainder / 10)];
                if (remainder % 10 > 0) str += " " + words[remainder % 10];
            }
            return str;
        }

        let mainAmount = Math.floor(amount);
        if (mainAmount === 0) return "Rupees Zero" + fractionStr;

        let crores = Math.floor(mainAmount / 10000000);
        mainAmount %= 10000000;
        let lakhs = Math.floor(mainAmount / 100000);
        mainAmount %= 100000;
        let thousands = Math.floor(mainAmount / 1000);
        mainAmount %= 1000;

        let result = "";
        if (crores > 0) result += convertLessThanOneThousand(crores) + " Crore ";
        if (lakhs > 0) result += convertLessThanOneThousand(lakhs) + " Lakh ";
        if (thousands > 0) result += convertLessThanOneThousand(thousands) + " Thousand ";
        if (mainAmount > 0) result += convertLessThanOneThousand(mainAmount);

        return "INR " + result.trim() + fractionStr;
    }
};