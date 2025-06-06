function ToastHandler(responseMsg, statusCode) {
    
    responseMsg = responseMsg.charAt(0).toUpperCase() + responseMsg.slice(1);
    var type = "error";
    if (statusCode == 200) {
        type = "success";
    }
    nativeToast({
        message: responseMsg,
        position: 'north-east',
        // Self destroy in 5 seconds
        timeout: 1500,
        type: type,
        rounded: true,
        closeOnClick: true
    })
    // or nativeToast.warning(options)
}