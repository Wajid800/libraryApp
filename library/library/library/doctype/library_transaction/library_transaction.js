frappe.ui.form.on('Library Transaction', {
	refresh: function(frm) {
        // Add a custom button on the form
        frm.add_custom_button("Get Transaction History", function() {
            
            if(!frm.doc.library_member) {
                frappe.msgprint("Please select a member first!");
                return;
            }

            // Fetch data from Member DocType
            frappe.call({
                method: "getTransactionData",
                args: {
                    member: frm.doc.library_member
                },
                callback: function(r) {
                    let html = "";
                    
                    r.tData.forEach(transaction => {
                        if (transaction) {
                            let fine_html = "";
                            if (transaction.fine_amount) {
                                fine_html = `<b>Fine:</b> ${transaction.fine_amount}<br>
                                             <b>Fine Status: </b> ${transaction.fine_status} <br>`;
                            }
                            html += `
                                <div style="padding:10px; background:#f5f5f5; border-radius:5px; margin-bottom:8px;">
                                    <b>ID:</b> ${transaction.name}<br>
                                    <b>Status:</b> ${transaction.status}<br>
                                    ${fine_html}
                                </div>
                            `;
                        }
                    });
                
                    frm.fields_dict.transaction_history.$wrapper.html(html);
                }

            });
        });
    },
	library_member: function(frm){
	    frappe.call({
	      method: "libraryTransactionAPI",
	      args:{
	           "libraryMember": frm.doc.library_member,
	      },
	      callback:function(r){
	          if(r.memberStatus !== "Active"){
	              frappe.msgprint("Membership Expired. You cannot Make transaction. Please renew the memberhsip before transaction");
	              
	          }
	      }
	  });
	},
	due_date: function(frm){
	    if (frm.doc.due_date && frm.doc.issue_date) {
            if (frm.doc.due_date < frm.doc.issue_date) {
                frappe.msgprint("Due Date date cannot be less than Issued Date.");
                frm.set_value("due_date", ""); // optional: reset field
            }
        }
	},
	return_date: function(frm){
	    if (frm.doc.return_date && frm.doc.issue_date) {
            if (frm.doc.return_date < frm.doc.issue_date) {
                frappe.msgprint("Return Date date cannot be less than Issued Date.");
                frm.set_value("return_date", ""); // optional: reset field
                frm.set_value("status", "Issued");
            } else {
                
                    frm.set_value("status", "Returned");
                    if (frm.doc.return_date>frm.doc.due_date){
                        let timeDiff = frm.doc.return_date - frm.doc.due_date;           // difference in milliseconds
                        let daysLate = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // convert to days
                        frm.set_value("fine_amount", daysLate * 5);             
                    }
                
            }
        }
        let due_date = new Date(frm.doc.due_date);
        let return_date = new Date(frm.doc.return_date);

        if (return_date > due_date) {
            // Calculate difference in days
            let timeDiff = return_date - due_date;           // difference in milliseconds
            let daysLate = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // convert to days

            frm.set_value("fine_amount", daysLate * 5);
        }
   
	},
	
	
	validate: function(frm){
	  let libraryMember = frm.doc.library_member;
	  frappe.call({
	      method: "getMemshipStatus",
	      args:{
	          "library_member": libraryMember,
	      },
	      callback:function(r){
	          let membershipStatus = r.status;
	       //   frappe.msgprint(membershipStatus)
	          if (membershipStatus === "Expired"){
        	      msgprint("Sorry, This members membership got expired. Please renew before transaction");
        	      validated = false;
        	  }
	      }
	  });
	  
	}
});
