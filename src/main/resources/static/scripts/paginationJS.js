    const currentWeekElement = document.querySelector('.current-week');
    const prevWeekBtn = document.querySelector('.prev-week');
    const nextWeekBtn = document.querySelector('.next-week');
    let currentWeek = 0;

    function CurrentWeek(weekOffset) {
      const today = new Date();

      const monday = new Date(today.getTime() - (today.getDay() - 1) * 86400000);
      const saturday = new Date(monday.getTime() + 5 * 86400000);

      monday.setDate(monday.getDate() + weekOffset * 7);
      saturday.setDate(saturday.getDate() + weekOffset * 7);

      const mondayText = monday.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
      const saturdayText = saturday.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });

      currentWeekElement.textContent = `${mondayText} - ${saturdayText}`;
    }

    prevWeekBtn.addEventListener('click', () => {
        currentWeek--;
        CurrentWeek(currentWeek);
        getDate(currentWeek);
        getEvents(currentWeek);
    });

    nextWeekBtn.addEventListener('click', () => {
        currentWeek++;
        CurrentWeek(currentWeek);
        getDate(currentWeek);
        getEvents(currentWeek);
    });

    function getDate(weekOffset) {
       const currentDate = new Date();

       const mondayDate = new Date(currentDate.getTime() - (currentDate.getDay() - 1) * 24 * 60 * 60 * 1000);

       mondayDate.setDate(mondayDate.getDate() + weekOffset * 7);

       const tuesdayDate = new Date(mondayDate.getTime() + 24 * 60 * 60 * 1000);
       const wednesdayDate = new Date(mondayDate.getTime() + 2 * 24 * 60 * 60 * 1000);
       const thursdayDate = new Date(mondayDate.getTime() + 3 * 24 * 60 * 60 * 1000);
       const fridayDate = new Date(mondayDate.getTime() + 4 * 24 * 60 * 60 * 1000);
       const saturdayDate = new Date(mondayDate.getTime() + 5 * 24 * 60 * 60 * 1000);

       document.querySelector('.day.mon .date-num').textContent = mondayDate.getDate() + ' '
                                            + getMonthName(mondayDate.getMonth()) + ' ' + mondayDate.getFullYear();
       document.querySelector('.day.tues .date-num').textContent = tuesdayDate.getDate() + ' '
                                            + getMonthName(tuesdayDate.getMonth()) + ' ' + tuesdayDate.getFullYear();
       document.querySelector('.day.wed .date-num').textContent = wednesdayDate.getDate() + ' '
                                            + getMonthName(wednesdayDate.getMonth()) + ' ' + wednesdayDate.getFullYear();
       document.querySelector('.day.thurs .date-num').textContent = thursdayDate.getDate() + ' '
                                            + getMonthName(thursdayDate.getMonth()) + ' ' + thursdayDate.getFullYear();
       document.querySelector('.day.fri .date-num').textContent = fridayDate.getDate() + ' '
                                            + getMonthName(fridayDate.getMonth()) + ' ' + fridayDate.getFullYear();
       document.querySelector('.day.sat .date-num').textContent = saturdayDate.getDate() + ' '
                                            + getMonthName(saturdayDate.getMonth()) + ' ' + saturdayDate.getFullYear();
    }

    function getMonthName(monthIndex) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                          'September', 'October', 'November', 'December'];
      return monthNames[monthIndex];
    }
