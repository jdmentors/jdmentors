function cleanFileName(url) {
    const fileName = url.split('/').pop();
    const cleaned = fileName.replace(/-\d+(?=\.\w+$)/, '');
    return cleaned;
}


export default cleanFileName;