import React from 'react'
import {Upload,Button,Icon,message} from 'antd'

class UploadFile extends React.Component{
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //       ...props,
  //       // fileList: [{
  //       //      uid: '-1',
  //       //      name: 'xxx.png',
  //       //      status: 'done',
  //       //      url: 'http://www.baidu.com/xxx.png',
  //       // }],
  //       file:{},
  //   }
  //   this.handelChange = this.handelChange.bind(this);
// }

  handelChange = (info)=> {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
      const res = info.file.response.name;
      console.log(res);
      this.setState({
        tipUrl:res
      })
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    // let fileList = info.fileList;

    //     // 1. Limit the number of uploaded files
    //     // Only to show two recent uploaded files, and old ones will be replaced by the new
    //     fileList = fileList.slice(-2);

    //     // 2. Read from response and show file link
    //     fileList = fileList.map((file) => {
    //       if (file.response) {
    //         // Component will show file.url as link
    //         file.url = file.response.url;
    //       }
    //       return file;
    //     });

    //     // 3. Filter successfully uploaded files according to response from server
    //     fileList = fileList.filter((file) => {
    //       if (file.response) {
    //         return file.response.status === 'success';
    //       }
    //       return false;
    //     });

    //     this.setState({ fileList });
  }
  render(){
    const props = {
      name: 'file',
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
        authorization: 'authorization-text',
      },
      onChange:this.handelChange,
    };
    console.log(this.state);
    return (
      <Upload {...props}>
        <Button>
          <Icon type="upload" /> Click to Upload
        </Button>
      </Upload>
    )
  }
}

export default UploadFile