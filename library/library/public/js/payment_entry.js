frappe.ui.form.on('Payment Entry', {
    // onload: function(frm) {
    //     frm.set_query('mode_of_payment', function() {
    //         return {
    //             filters: {
    //                 'custom_is_pos': 0   // Sirf woh records show karein jinka custom_is_pos unchecked hai
    //             }
    //         };
    //     });
    // },
    refresh: function(frm) {
        frappe.msgprint(__('Hello! This message is from my custom app.'));
        console.log("Payment Entry form loaded (custom app JS)");
    },
    validate: function(frm) {
        frappe.msgprint(__('This message appears before saving.'));
    }
});
