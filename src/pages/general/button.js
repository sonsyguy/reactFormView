import React, { Component } from 'react';
import { Form, Input, Button} from 'antd';

class TestButton extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  passwordValidator = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }


  render (){
    const { form } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item
          label="E-mail"
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input />
          )}
        </Form.Item>

        <Form.Item
          label="Password"
        >
        {getFieldDecorator('password', {
            rules: [{
              required: true,
              message: '密码不能为空',
            }, {
            min:4,
            message: '密码不能少于4个字符',
          }, {
            max:6,
            message: '密码不能大于6个字符',
          }],
         })(
        <Input placeholder="请输入密码" type="password"/>
        )}
        </Form.Item>

        <Form.Item
          label="string"
        >
            {getFieldDecorator('nickname', {
            rules: [{
            required: true,
            message: '昵称不能为空',
          }, {
            len: 4,
            message: '长度需4个字符',
          }],
         })(
       <Input placeholder="请输入昵称" />
        )}
        </Form.Item>


        <Form.Item
          label="string"
        >
        {getFieldDecorator('passwordcomfire', {
          rules: [{
            required: true,
            message: '请再次输入密码',
          }, {
            validator: this.passwordValidator
        }],
        })(
          <Input placeholder="请输入密码" type="password"/>
        )}
        </Form.Item>


        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">TestBtn</Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create({ name: '' })(TestButton);