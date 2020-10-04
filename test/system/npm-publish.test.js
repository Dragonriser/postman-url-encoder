const expect = require('chai').expect,
    // eslint-disable-next-line security/detect-child-process
    { execSync: exec } = require('child_process');

describe('npm publish', function () {
    const packageInfo = JSON.parse(exec('npm pack --dry-run --json'))[0];

    it('should have a valid package name', function () {
        expect(packageInfo.name).to.equal('postman-url-encoder');
    });

    it('should not publish unnecessary files', function () {
        const allowedFiles = ['index.js', 'legacy.js', 'package.json', 'LICENSE.md', 'README.md', 'CHANGELOG.yaml'];

        packageInfo.files.map(({ path }) => {
            expect(allowedFiles.includes(path) ||
                path.startsWith('encoder/') ||
                path.startsWith('parser/')).to.be.true;
        });
    });
});
