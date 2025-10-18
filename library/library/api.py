import frappe

def test_message(doc, method):
    frappe.msgprint(f"Item {doc.item_name} has been saved successfully!")
    

def update_membership_and_transactions():
    """Scheduler event to expire old memberships and mark overdue library transactions."""

    # --- 1. Expire Members whose membership has passed ---
    expired_members = frappe.get_all(
        "Member",
        filters={
            "membership_expiry_date": ("<", today()),
            "status": "Active"
        },
        pluck="name"
    )

    for member in expired_members:
        frappe.db.set_value("Member", member, "status", "Expired")
    
    if expired_members:
        frappe.db.commit()  # Commit to apply changes

    # --- 2. Mark overdue Library Transactions ---
    overdue_transactions = frappe.get_all(
        "Library Transaction",
        filters={
            "due_date": ("<", today()),
            "status": "Issued"
        },
        pluck="name"
    )

    for transaction in overdue_transactions:
        frappe.db.set_value("Library Transaction", transaction, "status", "Overdue")

    if overdue_transactions:
        frappe.db.commit()
