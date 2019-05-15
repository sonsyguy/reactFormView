import React from 'react';
import {
  Form,
  Input,
  Select,
  Checkbox,
  Button,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//简单的eventemit，在实际项目中使用成熟的第三方组件
const isFunction = function(obj) {
  return typeof ojb === 'function' || false;
};

class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  addListener(label, callback) {
    this.listeners.has(label) || this.listeners.set(label, []);
    this.listeners.get(label).push(callback);
  }
  removeListener(label, callback) {
    let listeners = this.listeners.get(label);
    let index;
    if (listeners && listeners.length) {
      index = listeners.reduce((i, listener, index) => {
        return isFunction(listener) && listener === callback ? (i = index) : i;
      }, -1);
    }
    if (index > -1) {
      listeners.splice(index, 1);
      this.listeners.set(label, listeners);
      return true;
    }

    return false;
  }
  emit(label, ...args) {
    let listeners = this.listeners.get(label);
    if (listeners && listeners.length) {
      listeners.forEach(listener => {
        listener(...args);
      });
      return true;
    }

    return false;
  }
}

class Observer {
  constructor(subject) {
    this.subject = subject;
  }
  on(label, callback) {
    this.subject.addListener(label, callback);
  }
}

let observable = new EventEmitter();
let observer = new Observer(observable);

//##############################################################

// 双向绑定的表单的数据
const formBinding = WrappedComponent => {
  return class extends React.Component {
    state = {
      scope: {},
    };

    onFormChange = values => {
      console.log('form change');
      console.log(values);
      console.log(this.state.scope);

      const tempScope = Object.assign({}, this.state.scope);

      this.setState(
        {
          scope: Object.assign(tempScope, values),
        },
        () => {
          // 发送同步实际组件的事件
          observable.emit('syncFormState', this.state.scope);
        },
      );
    };

    render() {
      return (
        <WrappedComponent
          scope={this.state.scope}
          onFormChange={this.onFormChange}
        />
      );
    }
  };
};

// 监听事件，将表单的数据同步到实际组件的state上
const watcher = Component => {
  return class extends React.Component {
    componentDidMount() {
      observer.on('syncFormState', data => {
        this.handleSyncEvent(data);
      });
    }

    handleSyncEvent(data) {
      this.node.setState({
        formScope: Object.assign({}, data),
      });
    }

    render() {
      return <Component ref={node => (this.node = node)} {...this.props} />;
    }
  };
};

@formBinding
@Form.create({
  mapPropsToFields(props) {
    // 使用上层组件的scope的值作为表单的数据
    const { scope } = props;

    return {
      nickname: Form.createFormField({
        value: scope.nickname,
      }),
      phone: Form.createFormField({
        value: scope.phone,
      }),
      address: Form.createFormField({
        value: scope.address,
      }),
      agreement: Form.createFormField({
        value: scope.agreement,
      }),
    };
  },
  onValuesChange(props, values) {
    // 将表单的变化值回填到上层组件的scope中
    props.onFormChange(values);
  },
})
@watcher // 接受事件去更新state
class Demo extends React.Component {
  state = {
    formScope: {},
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        console.log('Received values of form: ', values);
      }

      console.log('value');
      console.log(values);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 60 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>,
    );

    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label={<span>Nickname</span>} hasFeedback>
          {getFieldDecorator('nickname', {
            rules: [
              {
                required: true,
                message: 'Please input your nickname!',
                whitespace: true,
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="Phone Number">
          {getFieldDecorator('phone', {
            rules: [
              { required: true, message: 'Please input your phone number!' },
            ],
          })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
        </FormItem>

        {this.state.formScope.nickname && this.state.formScope.phone ? (
          <FormItem {...formItemLayout} label="Address">
            {getFieldDecorator('address', {
              rules: [{ required: true, message: 'Please input your address' }],
            })(<Input style={{ width: '100%' }} />)}
          </FormItem>
        ) : null}

        <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
          {getFieldDecorator('agreement', {
            valuePropName: 'checked',
          })(
            <Checkbox>
              I have read the agreement
            </Checkbox>,
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </FormItem>

        
      </Form>
      <pre style={{width:500,height:autoCompleteResult,background:"#f0f"}}>{JSON.stringify(this.state.formScope,null,2)}</pre>
      </div>
    );
  }
}

export default Demo