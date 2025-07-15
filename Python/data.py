import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

np.random.seed(42)
random.seed(42)

# Configurations
categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health']
wallets = ['ICICI', 'HDFC', 'PhonePe', 'GPay']
payment_methods = ['UPI', 'Credit Card', 'Net Banking']
user_types = ['Saver', 'Balanced', 'Over-Spender']
num_users = 200
months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06']
transactions_per_user_per_month = 42

def generate_random_date(month_str):
    start_date = datetime.strptime(month_str, '%Y-%m')
    end_date = (start_date.replace(day=28) + timedelta(days=4)).replace(day=1)
    delta = end_date - start_date
    return start_date + timedelta(days=random.randint(0, delta.days - 1))

all_data = []

for user_id in range(1, num_users + 1):
    user_tag = f'user_{user_id}'
    user_type = random.choice(user_types)
    income = random.randint(30000, 150000)

    for month in months:
        savings_goal = random.randint(3000, 10000)
        category_budgets = {cat: random.randint(3000, 8000) for cat in categories}
        category_spent = {cat: 0 for cat in categories}
        category_allocated = {cat: category_budgets[cat] - random.randint(0, 1000) for cat in categories}
        monthly_transactions = []

        for _ in range(transactions_per_user_per_month):
            category = random.choice(categories)
            amount = np.round(np.random.uniform(100, 2000), 2)
            description = f'{category} purchase'
            date = generate_random_date(month)

            wallet = random.choice(wallets)
            if wallet in ['PhonePe', 'GPay']:
                payment_method = 'UPI'
            else:
                payment_method = random.choice(payment_methods)

            category_spent[category] += amount
            budget_limit = category_budgets[category]
            allocated = category_allocated[category]
            overspent = category_spent[category] > budget_limit
            actual_spent = category_spent[category]

            txn = {
                'transaction_id': f'TXN_{user_id}_{month}_{random.randint(1000,9999)}_{random.randint(100,999)}',
                'user_id': user_tag,
                'date': date.strftime('%Y-%m-%d'),
                'day_of_month': date.day,
                'month': month,
                'amount': amount,
                'description': description,
                'category': category,
                'budget_limit': budget_limit,
                'month_total_spent': None,
                'payment_method': payment_method,
                'wallet': wallet,
                'is_anomaly': False,  # placeholder, update later
                'user_type': user_type,
                'overspent_flag': overspent,
                'savings_this_month': None,
                'income_this_month': income,
                'category_allocated': allocated,
                'actual_spent': actual_spent,
                'goal_target': savings_goal,
                'goal_achieved': None
            }

            monthly_transactions.append(txn)

        total_spent = sum(txn['amount'] for txn in monthly_transactions)
        savings = income - total_spent
        goal_achieved = savings >= savings_goal

        for txn in monthly_transactions:
            txn['month_total_spent'] = total_spent
            txn['savings_this_month'] = savings
            txn['goal_achieved'] = goal_achieved

        all_data.extend(monthly_transactions)

# Convert to DataFrame
df = pd.DataFrame(all_data)

# Compute average spend per user-category
avg_spend = df.groupby(['user_id', 'category'])['amount'].mean().reset_index()
avg_spend.rename(columns={'amount': 'avg_spend'}, inplace=True)
df = df.merge(avg_spend, on=['user_id', 'category'], how='left')

# Apply anomaly logic with randomness
def detect_anomaly(row):
    amt = row['amount']
    avg = row['avg_spend']
    if amt > 1.5 * avg and np.random.rand() < 0.95:
        return True
    elif amt > 1.2 * avg and np.random.rand() < 0.2:
        return True
    return False

df['is_anomaly'] = df.apply(detect_anomaly, axis=1)
df.drop(columns=['avg_spend'], inplace=True)


# ✅ Shuffle all rows to remove ordering by user/month
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

# Save to CSV
df.to_csv("./synthetic_fintrackr_dataset.csv", index=False)
print(f"✅ Dataset generated: {len(df)} rows saved with anomaly detection applied.")
