"""
    Before test, you should clear datastore, run GAE local server and update 'setUp()'.
"""

import unittest, json, re
import requests


class TestTakanashiFunctions(unittest.TestCase):
    def setUp(self):
        self.url = 'http://localhost:8080'
        self.email = 'kelp@phate.org'
        self.cookies = { 'dev_appserver_login': "kelp@phate.org:True:111325016121394242422" }
        self.application_name = 'Application-X'


    def test_redirect_login_page(self):
        """
        test redirect to login page when the user does not sign in.
        """
        r = requests.get(self.url, allow_redirects=False)
        self.assertEqual(r.status_code, 302)
        self.assertRegexpMatches(r.headers['location'], '%s/login.*' % self.url)

    def test_login_page(self):
        """
        test sign in page.
        """
        r = requests.get(self.url)
        self.assertEqual(r.status_code, 200)
        self.assertRegexpMatches(r.content, '.*<legend>Sign In</legend>.*')

    def test_settings_profile_page(self):
        """
        test settings/profile.
        """
        r = requests.get('%s/settings/profile' % self.url, cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        self.assertRegexpMatches(r.content, '.*<.*name="account".*value="kelp@phate.org".*')

    def test_settings_users(self):
        """
        test settings/users
        """
        r = requests.get('%s/settings/users' % self.url, cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        self.assertRegexpMatches(r.content, '.*<td>%s</td>.*' % self.email)

    def test_00_settings_applications_add(self):
        """
        add an application for test
        """
        # add an application
        r = requests.post('%s/settings/applications' % self.url, cookies=self.cookies, data={
            'name': self.application_name,
            'description': ''
        })
        self.assertEqual(r.status_code, 200)
        result = json.loads(r.content)
        self.assertEqual(result['success'], True)

    def test_02_settings_application_delete(self):
        """
        delete the test application
        """
        # get applications
        r = requests.get('%s/settings/applications' % self.url, cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        application_id = re.search('<form id="application(\d+)"', r.content).group(1)

        # delete the application
        r = requests.delete('%s/settings/applications/%s' % (self.url, application_id), cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        result = json.loads(r.content)
        self.assertEqual(result['success'], True)


if __name__ == '__main__':
    unittest.main()