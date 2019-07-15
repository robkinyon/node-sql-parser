'use strict';

const { expect } = require('chai');
const { Parser } = require('../');


describe('DROP AND TRUNCATE', () => {
  const parser = new Parser();
  let sql;

  function getParsedSql(sql) {
    const ast = parser.astify(sql);
    return parser.sqlify(ast);
  }

  describe('drop and truncate', () => {
    ['drop', 'truncate'].forEach(action => {
      it(`should support MySQL ${action}`, () => {
        expect(getParsedSql(`${action} table tableA`))
          .to.equal(`${action.toUpperCase()} TABLE \`tableA\``);
      });

      it(`should support MySQL ${action} with db prefix`, () => {
        expect(getParsedSql(`${action} table dbA.tableA`))
          .to.equal(`${action.toUpperCase()} TABLE \`dbA\`.\`tableA\``);
      });

    })

  })

  describe('rename', () => {
    it(`should support MySQL rename`, () => {
      expect(getParsedSql('rename table a to b'))
        .to.equal('RENAME TABLE `a` TO `b`');
    });

    it(`should support MySQL rename multiples`, () => {
      expect(getParsedSql('rename table a to b, c to d'))
        .to.equal('RENAME TABLE `a` TO `b`, `c` TO `d`');
    });

    it(`should support MySQL rename multiples with db prefix`, () => {
      expect(getParsedSql('rename table d.a to d.b, d.c to d.d'))
        .to.equal('RENAME TABLE `d`.`a` TO `d`.`b`, `d`.`c` TO `d`.`d`');
    });
  })

  describe('call', () => {
    it('should support MySQL call', () => {
      expect(getParsedSql('call sp(1, "123")'))
        .to.equal('CALL sp(1, \'123\')')
    })

    it('should support MySQL call with no parameters', () => {
      expect(getParsedSql('call sp()'))
        .to.equal('CALL sp()')
    })

    it('should support MySQL call without parentheses and parameters', () => {
      expect(getParsedSql('call sp'))
        .to.equal('CALL sp')
    })

    it('should support MySQL call without dynamic value', () => {
      expect(getParsedSql('call sp(@firstParameter, @secondParameter)'))
        .to.equal('CALL sp(@firstParameter, @secondParameter)')
    })

  })
})