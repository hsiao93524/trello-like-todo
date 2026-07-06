(function(root){

    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

    function getWeekDates(weekOffset = 0){

        const now = new Date();

        const day = now.getDay();

        const diff = day === 0 ? -6 : 1 - day;

        const monday = new Date(now);

        monday.setDate(
            now.getDate() + diff + (weekOffset * 7)
        );

        const dates = [];

        for(let i=0;i<7;i++){

            const d = new Date(monday);

            d.setDate(monday.getDate() + i);

            dates.push({
                month:d.getMonth()+1,
                date:d.getDate(),
                full:d,
                label:`${d.getMonth()+1}/${d.getDate()} ${days[i]}`
            });
        }

        return dates;
    }

    function formatDate(date){

        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2,"0");

        const day = String(
            date.getDate()
        ).padStart(2,"0");

        return `${year}-${month}-${day}`;
    }

    function formatDateTime(value){

        const date =
            new Date(value);

        if(Number.isNaN(date.getTime())){
            return value || "";
        }

        return new Intl.DateTimeFormat("en-US", {
            year:"numeric",
            month:"numeric",
            day:"numeric",
            hour:"numeric",
            minute:"2-digit",
            second:"2-digit",
            hour12:true
        }).format(date);
    }

    function isSameDate(dateA, dateB){

        return dateA.toDateString() ===
            dateB.toDateString();
    }

    function getTwoWeekRangeLabel(currentWeek){

        const week1 =
            getWeekDates(currentWeek);

        const week2 =
            getWeekDates(currentWeek+1);

        return `${week1[0].month}/${week1[0].date}
        ~
        ${week2[6].month}/${week2[6].date}`;
    }

    function getDefaultTaskDate(){
        return formatDate(new Date());
    }

    const api = {
        getWeekDates,
        formatDate,
        formatDateTime,
        isSameDate,
        getTwoWeekRangeLabel,
        getDefaultTaskDate
    };

    root.TRELLO_LIKE_TODO_DATES = api;

    if(
        typeof module !== "undefined" &&
        module.exports
    ){
        module.exports = api;
    }

})(typeof window !== "undefined" ? window : globalThis);
