export const formatDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const decode = (str)  => {

    let txt = new DOMParser().parseFromString(str, "text/html");

    return txt.documentElement.textContent;

}