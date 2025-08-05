(function(Scratch) {
  'use strict';

  // 存储所有类和实例
  const classes = {};
  const instances = {};

  class OOPExtension {
    getInfo() {
      return {
        id: 'oop',
        name: '面向对象',
        blocks: [
          {
            opcode: 'defineClass',
            blockType: Scratch.BlockType.HAT, // 帽子积木
            text: '定义类 [CLASSNAME] 属性 [PROPS]',
            arguments: {
              CLASSNAME: { type: Scratch.ArgumentType.STRING },
              PROPS: { type: Scratch.ArgumentType.STRING } // 逗号分隔的属性列表
            }
          },
          {
            opcode: 'defineMethod',
            blockType: Scratch.BlockType.CONDITIONAL, // C形嵌套积木
            text: '方法 [METHOD] 参数 [PARAMS]',
            arguments: {
              METHOD: { type: Scratch.ArgumentType.STRING },
              PARAMS: { type: Scratch.ArgumentType.STRING }
            },
            branchCount: 1 // 允许嵌套积木
          },
          {
            opcode: 'newInstance',
            blockType: Scratch.BlockType.REPORTER,
            text: '新建 [CLASSNAME] 实例',
            arguments: {
              CLASSNAME: { type: Scratch.ArgumentType.STRING }
            }
          },
          {
            opcode: 'callMethod',
            blockType: Scratch.BlockType.REPORTER,
            text: '调用 [INSTANCE].[METHOD] 参数 [ARGS]',
            arguments: {
              INSTANCE: { type: Scratch.ArgumentType.STRING },
              METHOD: { type: Scratch.ArgumentType.STRING },
              ARGS: { type: Scratch.ArgumentType.STRING } // JSON 格式参数
            }
          },
          {
            opcode: 'returnValue',
            blockType: Scratch.BlockType.COMMAND,
            text: '返回 [VALUE]',
            arguments: {
              VALUE: { type: Scratch.ArgumentType.STRING }
            }
          }
        ]
      };
    }

    // 定义类
    defineClass(args, util) {
      const className = args.CLASSNAME;
      const props = args.PROPS.split(',');
      classes[className] = { props, methods: {} };
    }

    // 定义方法
    defineMethod(args, util) {
      const methodName = args.METHOD;
      const currentClass = util.thread.getBlockContext('defineClass');
      if (currentClass && classes[currentClass]) {
        classes[currentClass].methods[methodName] = util.thread.peekStack();
      }
    }

    // 实例化对象
    newInstance(args) {
      const className = args.CLASSNAME;
      if (!classes[className]) return '类未定义';
      const instanceId = `instance_${Date.now()}`;
      instances[instanceId] = { class: className, props: {} };
      return instanceId;
    }

    // 调用方法
    callMethod(args, util) {
      const instance = instances[args.INSTANCE];
      if (!instance) return '实例不存在';
      const method = classes[instance.class]?.methods[args.METHOD];
      if (!method) return '方法未定义';

      // 执行方法并返回结果
      const thread = util.thread.pushStack(method);
      thread.reportReturnValue = true;
      return thread;
    }

    // 返回值
    returnValue(args, util) {
      util.thread.reportValue = args.VALUE;
      util.thread.stopThisScript();
    }
  }

  Scratch.extensions.register(new OOPExtension());
})(Scratch);