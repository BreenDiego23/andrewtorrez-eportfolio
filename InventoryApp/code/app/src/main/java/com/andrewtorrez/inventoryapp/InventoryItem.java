package com.andrewtorrez.inventoryapp;

// This class defines the structure of an InventoryItem object
public class InventoryItem {
    private int id;         // Unique ID for the item (used by the database)
    private String name;    // Name of the inventory item
    private int quantity;   // Quantity of the item

    // Constructor WITH ID: used when retrieving data from the database
    public InventoryItem(int id, String name, int quantity) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
    }

    // Constructor WITHOUT ID: used when creating a new item to insert into the database
    public InventoryItem(String name, int quantity) {
        this.id = -1; // Placeholder ID; will be set by the database upon insertion
        this.name = name;
        this.quantity = quantity;
    }

    // Getter method for the item's ID
    public int getId() {
        return id;
    }

    // Getter method for the item's name
    public String getName() {
        return name;
    }

    // Getter method for the item's quantity
    public int getQuantity() {
        return quantity;
    }

    // Setter method to update the item's quantity
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}