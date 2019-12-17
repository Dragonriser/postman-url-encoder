var expect = require('chai').expect,
    urlEncoder = require('../../index.js'),
    sdk = require('postman-collection');

describe('encoder', function () {
    describe('encodeAuth()', function () {
        it('should return empty string for invalid argument', function () {
            expect(urlEncoder.encodeAuth({})).to.eql('');
            expect(urlEncoder.encodeAuth(null)).to.eql('');
        });

        it('should encode unicode auth param', function () {
            expect(urlEncoder.encodeAuth('𝌆й你ス')).to.eql('%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9');
        });

        it('should not encode already encoded auth param', function () {
            expect(urlEncoder.encodeAuth('%25')).to.eql('%25');
        });
    });

    describe('encodeHost()', function () {
        it('should return empty string for invalid argument', function () {
            expect(urlEncoder.encodeHost({})).to.eql('');
            expect(urlEncoder.encodeHost(null)).to.eql('');
        });

        it('should accept host as an array', function () {
            expect(urlEncoder.encodeHost(['www', 'postman', 'com'])).to.eql('www.postman.com');
        });

        it('should encode unicode host', function () {
            expect(urlEncoder.encodeHost('邮差.com')).to.eql('xn--nstq34i.com');
        });

        it('should not encode already encoded unicode host', function () {
            expect(urlEncoder.encodeHost('xn--nstq34i.com')).to.eql('xn--nstq34i.com');
        });
    });

    describe('encodePath()', function () {
        it('should return empty string for invalid argument', function () {
            expect(urlEncoder.encodePath({})).to.eql('');
            expect(urlEncoder.encodePath(null)).to.eql('');
        });

        it('should accept path as an array', function () {
            expect(urlEncoder.encodePath(['foo', 'bar', 'baz'])).to.eql('foo/bar/baz');
        });

        it('should encode special characters in path', function () {
            expect(urlEncoder.encodePath('/ /"/#/</>/?/`/{/}')).to.eql('/%20/%22/%23/%3C/%3E/%3F/%60/%7B/%7D');
        });

        it('should encode unicode characters in path', function () {
            expect(urlEncoder.encodePath('/𝌆/й/你/ス')).to.eql('/%F0%9D%8C%86/%D0%B9/%E4%BD%A0/%E3%82%B9');
        });

        it('should not encode already encoded characters in path', function () {
            expect(urlEncoder.encodePath('/%25')).to.eql('/%25');
        });
    });

    describe('encodeQueryParam()', function () {
        it('should return empty string for invalid argument', function () {
            expect(urlEncoder.encodeQueryParam(null)).to.eql('');
            expect(urlEncoder.encodeQueryParam(undefined)).to.eql('');
        });

        it('should properly handle param without key', function () {
            expect(urlEncoder.encodeQueryParam({ value: 'bar' })).to.eql('=bar');
        });

        it('should properly handle param without value', function () {
            expect(urlEncoder.encodeQueryParam({ key: 'foo' })).to.eql('foo=');
        });

        it('should properly handle param without key and value', function () {
            expect(urlEncoder.encodeQueryParam({})).to.eql('');
        });

        it('should encode special characters in key', function () {
            expect(urlEncoder.encodeQueryParam({ key: ' "#\'<>', value: 'bar' })).to.eql('%20%22%23%27%3C%3E=bar');
        });

        it('should encode special characters in value', function () {
            expect(urlEncoder.encodeQueryParam({ key: 'foo', value: ' "#\'<>' })).to.eql('foo=%20%22%23%27%3C%3E');
        });

        it('should encode unicode characters in key', function () {
            expect(urlEncoder.encodeQueryParam({ key: '𝌆й你ス', value: 'bar' }))
                .to.eql('%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9=bar');
        });

        it('should encode unicode characters in value', function () {
            expect(urlEncoder.encodeQueryParam({ key: 'foo', value: '𝌆й你ス' }))
                .to.eql('foo=%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9');
        });

        it('should not encode already encoded characters', function () {
            expect(urlEncoder.encodeQueryParam({ key: '%25', value: '%25' })).to.eql('%25=%25');
        });
    });

    describe('encodeQueryParams()', function () {
        it('should return empty string for invalid argument', function () {
            expect(urlEncoder.encodeQueryParams(null)).to.eql('');
            expect(urlEncoder.encodeQueryParams(undefined)).to.eql('');
            expect(urlEncoder.encodeQueryParams('foo')).to.eql('');
        });

        it('should accept array of param objects in the argument', function () {
            var params = [
                { key: 'q1', value: 'v1' },
                { key: 'q2', value: 'v2' }
            ];

            expect(urlEncoder.encodeQueryParams(params)).to.eql('q1=v1&q2=v2');
        });

        it('should accept params object in the argument', function () {
            var params = {
                q1: 'v1',
                q2: 'v2'
            };

            expect(urlEncoder.encodeQueryParams(params)).to.eql('q1=v1&q2=v2');
        });

        it('should properly handle multiple values for a key in params object', function () {
            var params = {
                q1: ['v1_1', 'v1_2'],
                q2: 'v2'
            };

            expect(urlEncoder.encodeQueryParams(params)).to.eql('q1=v1_1&q1=v1_2&q2=v2');
        });

        it('should exclude disabled params when second argument is true', function () {
            var params = [
                { key: 'q1', value: 'v1', disabled: true },
                { key: 'q2', value: 'v2' }
            ];

            expect(urlEncoder.encodeQueryParams(params, true)).to.eql('q2=v2');
        });

        it('should not exclude disabled params when second argument is false', function () {
            var params = [
                { key: 'q1', value: 'v1', disabled: true },
                { key: 'q2', value: 'v2' }
            ];

            expect(urlEncoder.encodeQueryParams(params, false)).to.eql('q1=v1&q2=v2');
        });
    });

    describe('encodeHash()', function () {
        it('should return empty string for invalid argument', function () {
            expect(urlEncoder.encodeHash(null)).to.eql('');
            expect(urlEncoder.encodeHash(undefined)).to.eql('');
            expect(urlEncoder.encodeHash({})).to.eql('');
        });

        it('should encode unicode characters in given hash', function () {
            expect(urlEncoder.encodeHash('𝌆й你ス')).to.eql('%F0%9D%8C%86%D0%B9%E4%BD%A0%E3%82%B9');
        });

        it('should encode special characters in given hash', function () {
            expect(urlEncoder.encodeHash(' "<>`')).to.eql('%20%22%3C%3E%60');
        });

        it('should not encode already encoded characters', function () {
            expect(urlEncoder.encodeHash('%25')).to.eql('%25');
        });
    });

    describe('toNodeUrl()', function () {
        it('should return empty url for invalid argument', function () {
            var emptyUrl = {
                protocol: null,
                slashes: null,
                auth: null,
                host: null,
                port: null,
                hostname: null,
                hash: null,
                search: null,
                query: null,
                pathname: null,
                path: null,
                href: null
            };

            expect(urlEncoder.toNodeUrl(null)).to.eql(emptyUrl);
            expect(urlEncoder.toNodeUrl(undefined)).to.eql(emptyUrl);
            expect(urlEncoder.toNodeUrl([])).to.eql(emptyUrl);
            expect(urlEncoder.toNodeUrl({})).to.eql(emptyUrl);
        });

        describe('from PostmanUrl', function () {
            var list = require('../fixtures/postman-url-to-node-url');

            list.forEach(function (url) {
                it(url.title, function () {
                    var postmanUrl = new sdk.Url(url.in),
                        nodeUrl = urlEncoder.toNodeUrl(postmanUrl);

                    expect(nodeUrl).to.eql(url.out);
                });
            });
        });

        describe('from string URL', function () {
            var list = require('../fixtures/string-url-to-node-url');

            list.forEach(function (url) {
                it(url.title, function () {
                    var nodeUrl = urlEncoder.toNodeUrl(url.in);

                    expect(nodeUrl).to.eql(url.out);
                });
            });
        });
    });
});
