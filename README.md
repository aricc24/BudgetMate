# Financial Organizer

## Project Description

The **Financial Organizer** is a web application designed to help users manage their finances. The application allows users to register their monthly income and expenses, categorize expenses with tags (such as `food`, `transport`, and `housing`), and generate periodic financial reports. The system supports automatic email notifications with PDF attachments summarizing monthly income, expenses, and balance. It also includes features for managing debts and credit purchases, along with the ability to generate various reports and graphs.

## Features

- **Multi-user support**: Each user has their own account and cannot view or modify another user's finances.
- **Income and Expense Registration**: Users can log their income and expenses with descriptions and tags.
- **Expense Categories**: Users can manage predefined categories such as `food`, `transport`, and `housing`, and create custom categories.
- **Debt Management**: Users can record debts and track them. When a debt is marked as paid, it is automatically added to the expenses.
- **Automated Emails**: The system sends periodic emails (by default monthly) with financial summaries in PDF format.
- **Transaction Scheduling**: Users can schedule transactions (income or expenses) to be added at a specific time, with the option to repeat daily, weekly, or monthly.
- **Financial Reports**: Users can view financial reports in various formats (PDF, Excel) and filter by date ranges or categories.
- **Graphs and Visualizations**: Graphical representations of income and expenses (pie charts, bar charts) with options to filter by daily, weekly, monthly, or yearly periods.
- **Admin Interface**: Admin users can manage the system, view user statistics, and generate reports.

## Installation and Configuration

To set up the project locally, follow these steps:

 **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd financial-organizer

    Set up Docker: This is further explained in the Docker readme file.

To Create a superuser (Admin): To access the admin interface, create a superuser account:

    docker exec -it django_backend bash
    python manage.py createsuperuser
    then access http://127.0.0.1:8000/admin/ and enter the data

    Follow the prompts to set the username and password for the admin account.

    Access the application: Once the containers are up and running, you can access the application by visiting http://localhost:3000/ in your browser.

    Access the admin interface: You can access the admin interface at http://localhost:8000/admin/ and log in with the superuser credentials you created earlier.

Usage Instructions

    Register Transactions:
        You can register income and expenses through the web interface. Each transaction must include a description and be assigned a category (e.g., food, transport, housing).

    Set Up Automatic Emails:
        You can configure periodic email reports to be sent to your email with your financial summary. The email is sent by default monthly, but you can change the frequency.

    Schedule Transactions:
        Use the transaction scheduling feature to set up recurring income or expense transactions. Specify the frequency (daily, weekly, monthly) and the exact time for the transaction to be logged.

    View Reports:
        You can view financial reports (in PDF or Excel format) in the admin interface. These reports can be filtered by date range and category.

    Manage Debts:
        Record debts and mark them as paid. When marked as paid, the debt will automatically be added to the list of expenses.

Troubleshooting

If you encounter issues during setup or use, consider the following solutions:

    Docker container not starting: Ensure Docker is properly installed and running on your system. You can restart Docker and try running docker-compose up --build again.

    Superuser not working: If you’re unable to log into the admin interface, ensure that the superuser was created correctly and that the Django server is running.

    Transaction or email scheduling not working: Double-check your configurations in the app settings and make sure the scheduled times are set correctly.

License Information

This project is licensed under the MIT License. See the LICENSE file for more details.
Developer Information

The project was developed by the following team members:

    García Díaz Michelle Ariadna
    Cano Tenorio Alan Kevin
    Zaldivar Alanis Rodrigo
    Cervantes Farias Santiago

Feel free to reach out for support or collaboration inquiries
