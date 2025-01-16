class ApiResponse{
    constructor(statusCode,data,message="Sucess"){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=statusCode<400 //true when less than 400
        

    }
}

export {ApiResponse}