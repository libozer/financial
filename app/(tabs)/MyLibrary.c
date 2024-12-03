#include <stdio.h>

typedef struct {
    char name[50];
    double amount;
} Category;

double calculate_balance(double current_balance, double change_amount) {
    if (change_amount < 0) {
        return current_balance; 
    }
    return current_balance + change_amount;
}

int categoryExists(Category categories[], int categoryCount, const char* name) {
    for (int i = 0; i < categoryCount; i++) {
        if (strcmp(categories[i].name, name) == 0) {
            return 1;  
        }
    }
    return 0;  
}

void handleAddCategory(double* balance, Category categories[], int* categoryCount, const char* newCategoryName, double newCategoryAmount, double trimmedAmount) {
    if (trimmedAmount > *balance) {
        printf("Недостаточно средств\n");
        return;
    }

    int categoryIndex = -1;
    for (int i = 0; i < *categoryCount; i++) {
        if (strcmp(categories[i].name, newCategoryName) == 0) {
            categoryIndex = i;
            break;
        }
    }

    if (categoryIndex != -1) {
        categories[categoryIndex].amount += trimmedAmount;
    } else {
        strcpy(categories[*categoryCount].name, newCategoryName);
        categories[*categoryCount].amount = trimmedAmount;
        (*categoryCount)++;
    }

    updateBalance(balance, -trimmedAmount);
}

void handleResetChart(Category categories[], int* categoryCount) {
    *categoryCount = 0;  
}

void handleAmountChange(char* amount, const char* text) {
    int isValid = 1;
    for (int i = 0; text[i] != '\0'; i++) {
        if (!((text[i] >= '0' && text[i] <= '9') || text[i] == '.' || text[i] == '\0')) {
            isValid = 0;
            break;
        }
    }

    if (isValid) {
        strcpy(amount, text); 
    }
}
