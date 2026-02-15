// Replacement for code.gs logic
const FREE_DOMAINS = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"]; 

function refresh() {
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("companyName").value = "";
    document.getElementById("resultCont").innerHTML = "";
}

$("#EmailForm").submit(function(e) {
    $(".overlay").show();
    e.preventDefault();
    const companyName = document.getElementById("companyName").value.trim().toLowerCase();
    
    // Simulate google.script.run
    const isFree = FREE_DOMAINS.some(d => d.includes(companyName));
    const data = { exist: isFree ? "found" : "not found" };
    domain_check(data);
});

async function domain_check(data) {
    const resultCont = document.getElementById("resultCont");
    
    if (data.exist === "not found") {
        const firstName = document.getElementById("firstName").value.trim().toLowerCase();
        const lastName = document.getElementById("lastName").value.trim().toLowerCase();
        const companyName = document.getElementById("companyName").value.trim().toLowerCase();
        
        resultCont.innerHTML = "";
        
        const suggestions = [
            `${firstName}.${lastName}@${companyName}`,
            `${lastName}.${firstName}@${companyName}`,
            `${firstName}@${companyName}`,
            `${lastName}@${companyName}`,
            `${firstName.charAt(0)}${lastName}@${companyName}`,
            `${lastName.charAt(0)}${firstName}@${companyName}`,
            `${firstName.charAt(0)}.${lastName}@${companyName}`,
            `${lastName.charAt(0)}.${firstName}@${companyName}`,
            `${firstName}-${lastName}@${companyName}`,
            `${lastName}-${firstName}@${companyName}`
            // Add other variations from your original script as needed
        ];

        let str = '<tr style="background-color:#000000;color:#ffffff;height:10px;"><th style="font-weight:bold;">Email Address</th><th style="font-weight:bold;"></th><th style="font-weight:bold;">Output</th></tr>';
        resultCont.innerHTML = str;

        const key = "YOUR_API_KEY"; // Replace with your actual API key

        for (let i = 0; i < suggestions.length; i++) {
            let email = suggestions[i];
            let url = `https://api.zerobounce.net/v2/validate?api_key=${key}&email=${email}&ip_address=""`;
            
            try {
                let res = await fetch(url);
                let result = await res.json();
                
                let row = `<tr><td style="width:20%;">${result.address}</td>`;
                row += `<td style="width:5%;"><input type="text" style="display:none;" value="${result.address}"><button onclick="copyToClipboard(this)"><span class="ui-icon ui-icon-copy"></span></button></td>`;
                
                if (result.status === "valid") {
                    row += `<td style="background-color:#8cc63e;width:75%;color:#ffffff;font-weight:bold;text-transform: uppercase;"><div class="circle"><div class="checkmark"></div></div>${result.status}</td>`;
                } else if (result.status === "catch-all") {
                    row += `<td style="background-color:#baba2c;width:75%;color:#ffffff;font-weight:bold;text-transform: uppercase;"><div class="circleyellow"><div class="checkmark"></div></div>${result.status}</td>`;
                } else {
                    row += `<td style="width:75%;text-transform: uppercase;"><span class="crosssign"><div class="crosssign_circle"></div><div class="crosssign_stem"></div><div class="crosssign_stem2"></div></span> ${result.status}</td>`;
                }
                row += "</tr>";
                resultCont.innerHTML += row;
            } catch (error) {
                console.error("Error validating:", error);
            }
        }
        $(".overlay").hide();
    } else {
        resultCont.innerHTML = "<tr><td style='vertical-align: top;text-align: center;color: red;font-size: 25px;'>Inserted domain is a free domain.</td></tr>";
        $(".overlay").hide();
    }
}

function copyToClipboard(el) {
    var hidden = el.previousElementSibling;
    hidden.style.display = 'block';
    hidden.select();
    document.execCommand("copy");
    alert("Copied the text: " + hidden.value);
    hidden.style.display = 'none';
}
