# BudgetMate

## Project Description

**BudgetMate** is a web application designed to help users manage their finances. The application allows users to register their monthly income and expenses, categorize expenses with tags (such as `food`, `transport`, and `housing`), and generate periodic financial reports. The system supports automatic email notifications with PDF attachments summarizing monthly income, expenses, and balance. It also includes features for managing debts and credit purchases, along with the ability to generate various reports and graphs.

## Features

- **Multi-user support**: Each user has their own account and cannot view or modify another user's finances.
- **Email Authentication**: Users authenticate their account via email, ensuring secure login and verification.
- **Income and Expense Registration**: Users can log their income and expenses with descriptions and tags.
- **Expense Categories**: Users can manage predefined categories such as `food`, `transport`, and `housing`, and create or edit custom categories.
- **Debt Management**: Users can record debts and track them. When a debt is marked as paid, it is automatically added to the expenses.
- **Automated Emails**: The system sends periodic emails (by default monthly) with financial summaries in PDF format.
- **Transaction Scheduling**: Users can schedule transactions (income or expenses) to be added at a specific time, with the option to repeat daily, weekly, or monthly.
- **Financial Reports**: Users can view financial reports in PDF and these reports can be sent at the time or with the frequency that the user decides from a specific date.
- **Graphs and Visualizations**: Graphical representations of income and expenses (pie charts, bar charts) with options to filter by daily, weekly, monthly, or yearly periods.
- **Admin Interface**: Admin users can manage the system, view user statistics, and generate reports.
- **User Transaction History**: Users can view their transaction history, filter it by amount, categories, or date ranges, and analyze their past income and expenses.

## Installation and Configuration

To set up the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aricc24/BudgetMate
   cd BudgetMate
   ```

2. **Set up Docker:**
   Refer to the detailed instructions in the Docker README file.

3. **Create a superuser (Admin):**
   To access the admin interface, create a superuser account:

   ```bash
   docker exec -it django_backend bash
   python manage.py createsuperuser
   ```

   Then access the admin interface at [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) and log in using the credentials you created.

4. **Access the application:**
   Once the containers are up and running, you can access the application at [http://localhost:3000/](http://localhost:3000/) in your browser.

5. **Access the admin interface:**
   Log in with the superuser credentials you created earlier at [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/).

## Usage Instructions

- **Email Verification:**
  To access your account, you must provide a valid email address during registration. A verification email will be sent to your inbox. You need to open your email account in a web browser and click the verification link to activate your account.

- **Register Transactions:**
  You can register income and expenses through the web interface.  
  
- **Set Up Automatic Emails:**
  You can configure periodic email reports to be sent to your email with your financial summary. The email is sent by default monthly, but you can change the frequency.  
  
- **Schedule Transactions:**
  Use the transaction scheduling feature to set up recurring income or expense transactions. Specify the frequency (daily, weekly, monthly, yearly, none) and the exact time for the transaction to be logged.  
  
- **View Reports:**
  You can view financial reports (in PDF or Excel format) in the admin interface. These reports can be filtered by date range, category, and more.  
  
- **Manage Debts:**
  Record debts and mark them as paid. When marked as paid, the debt will automatically be added to the list of expenses.  

## Troubleshooting

If you encounter issues during setup or use, consider the following solutions:

- **Docker container not starting:**
  Ensure Docker is properly installed and running on your system. Restart Docker and try running `docker-compose up --build` again.

- **Superuser not working:**
  If you’re unable to log into the admin interface, ensure that the superuser was created correctly and that the Django server is running.

- **Problems with migrations:**
  If there are database issues, check for the migrations folder. If missing, create it along with the `__init__.py` file, delete all Docker volumes, and rebuild the containers.

## License Information

The project was developed by the following team members:

- García Díaz Michelle Ariadna
- Cano Tenorio Alan Kevin
- Zaldivar Alanis Rodrigo
- Cervantes Farias Santiago

Feel free to reach out for support or collaboration inquiries!

