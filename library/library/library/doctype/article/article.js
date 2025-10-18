// Copyright (c) 2025, isfak and contributors
// For license information, please see license.txt

frappe.ui.form.on('Article', {
	refresh(frm) {
		// your code here
		frm.add_custom_button("Add Dummy Article", function(){
		    frm.set_value("article_name", "Python for Everybody: Exploring Data Using Python 3");
		    frm.set_value("author", "Charles R. Severance");
		    frm.set_value("isbn", "978-1530051120");
		    frm.set_value("publisher", "CreateSpace Independent Publishing Platform");
		    frm.set_value("genre", "Education & Research");
		})
	}
})
function generateCode(length) {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}


frappe.ui.form.on('Article Copy Child', {
	book_copies_add: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        
        
        let code = generateCode(8);  // generates 8-character code
        frappe.model.set_value(cdt, cdn, "accession_number", code);
        frappe.model.set_value(cdt, cdn, "added_date", frappe.datetime.get_today());
    }
})