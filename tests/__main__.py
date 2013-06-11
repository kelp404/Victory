"""
    Before test, you should run GAE local server, and clear datastore, text search,
     and update url in function TestVictoryFunctions.setUp().
    --clear_datastore=yes --clear_search_indexes=yes

    unittest:
        $ cd Victory
        $ python tests
"""

import unittest, json, re, random
import requests
from bs4 import BeautifulSoup


class TestVictoryFunctions(unittest.TestCase):
    def setUp(self):
        self.url = 'http://localhost:8080'
        self.email = 'kelp@phate.org'
        self.cookies = {'dev_appserver_login': "kelp@phate.org:True:111325016121394242422"}
        self.application_name = 'Application-X'


    def test_404_page(self):
        """
        test 404 page
        """
        r = requests.get('%s/aaa' % self.url, allow_redirects=False)
        self.assertEqual(r.status_code, 404)
        soup = BeautifulSoup(r.content)
        self.assertEqual(soup.findAll('div', {'class': 'status'})[0].contents[0], '404')

    def test_405_page(self):
        """
        test 405 page
        """
        r = requests.post('%s/login' % self.url, allow_redirects=False)
        self.assertEqual(r.status_code, 405)
        soup = BeautifulSoup(r.content)
        self.assertEqual(soup.findAll('div', {'class': 'status'})[0].contents[0], '405')

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
        soup = BeautifulSoup(r.content)
        self.assertEqual(soup.findAll('legend')[0].contents[0], 'Sign In')

    def test_settings_profile_page(self):
        """
        test settings/profile.
        """
        r = requests.put('%s/settings/profile' % self.url, cookies=self.cookies, data={'name':'Kelp'})
        self.assertEqual(r.status_code, 200)
        result = json.loads(r.content)
        self.assertTrue(result['success'])

        r = requests.get('%s/settings/profile' % self.url, cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        soup = BeautifulSoup(r.content)
        self.assertEqual(len(soup.findAll('input', {'name': 'name', 'value': 'Kelp'})), 1)
        self.assertEqual(len(soup.findAll('input', {'name': 'account', 'value': 'kelp@phate.org'})), 1)

    def test_00_settings_users(self):
        """
        test settings/users
        """
        # add an user
        r = requests.post('%s/settings/users' % self.url, cookies=self.cookies, data={'email': 'user@phate.org'})
        self.assertEqual(r.status_code, 200)

        # get user list
        r = requests.get('%s/settings/users' % self.url, cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        self.assertRegexpMatches(r.content, '.*<td>user@phate.org</td>.*')

        # delete the user
        user_id = re.search('.*<a href="/settings/users/(\d+)#" class="delete_user">', r.content).group(1)
        r = requests.delete('%s/settings/users/%s' % (self.url, user_id), cookies=self.cookies)
        self.assertEqual(r.status_code, 200)

    def test_01_settings_applications_add(self):
        """
        add an application for test
        """
        # add an application
        r = requests.post('%s/settings/applications' % self.url, cookies=self.cookies, data={
            'name': self.application_name,
            'description': ''
        })
        self.assertEqual(r.status_code, 200)

    def test_02_add_exception_document(self):
        """
        add an exception document
        """
        # get applications
        r = requests.get('%s/settings/applications' % self.url, cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        application_key = re.search('<td>Key</td>.*<td>(.*)</td>', r.content).group(1)
        application_id = re.search('<form id="application(\d+)"', r.content).group(1)

        # add an exception
        title = 'handled exception %f' % random.random()
        r = requests.post('%s/api/v1/exception/%s' % (self.url, application_key), data={
            'name': 'Kelp',
            'title': title,
            "description": "log description",
            "email": "name@gmail.com",
            "version": "1.0 (1.0.012)",
            "device": "iPhone5,1",
            "os_version": "6.1",
            "access_token": "oauth access token",
            "method": "method of http request",
            "url": "http://victory-demo.appspot.com",
            "parameters": "parameters of http request",
            "status": "500"
        })
        self.assertEqual(r.status_code, 200)
        result = json.loads(r.content)
        self.assertTrue(result['success'])

        # get exception groups
        r = requests.get('%s/exception_groups' % self.url, cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        group_tag = re.search('<tr href="#document_(.+)" ', r.content).group(1)

        # get the exception group
        r = requests.get('%s/exception_groups/%s/%s' % (self.url, application_id, group_tag), cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        self.assertRegexpMatches(r.content, '<tr><td>Email</td><td>name@gmail.com</td></tr>')

    def test_03_add_log_document(self):
        """
        add a log document
        """
        # get applications
        r = requests.get('%s/settings/applications' % self.url, cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        application_key = re.search('<td>Key</td>.*<td>(.*)</td>', r.content).group(1)
        application_id = re.search('<form id="application(\d+)"', r.content).group(1)

        # add a log
        title = 'log %f' % random.random()
        r = requests.post('%s/api/v1/log/%s' % (self.url, application_key), data={
            'name': 'Kelp',
            'title': title,
            "description": "log description",
            "email": "name@gmail.com",
            "version": "1.0 (1.0.012)",
            "device": "iPhone5,1",
            "os_version": "6.1",
            "access_token": "oauth access token",
            "method": "method of http request",
            "url": "http://victory-demo.appspot.com",
            "parameters": "parameters of http request",
            "status": "500"
        })
        self.assertEqual(r.status_code, 200)
        result = json.loads(r.content)
        self.assertTrue(result['success'])

        # get log groups
        r = requests.get('%s/log_groups' % self.url, cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        group_tag = re.search('<tr href="#document_(.+)" ', r.content).group(1)

        # get the log group
        r = requests.get('%s/log_groups/%s/%s' % (self.url, application_id, group_tag), cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        self.assertRegexpMatches(r.content, '<tr><td>Email</td><td>name@gmail.com</td></tr>')

    def test_04_add_crash_document(self):
        """
        add a crash document
        """
        # get applications
        r = requests.get('%s/settings/applications' % self.url, cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        application_key = re.search('<td>Key</td>.*<td>(.*)</td>', r.content).group(1)

        # add a crash
        f = open('./tests/CrashTester-CrashReport.json', 'r')
        r = requests.post('%s/api/v1/crash/%s' % (self.url, application_key), files={'reports': f})
        f.close()
        self.assertEqual(r.status_code, 200)
        result = json.loads(r.content)
        self.assertTrue(result['success'])

        # get crash groups
        r = requests.get('%s/crash_groups' % self.url, cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        crash_detail_uri = re.search('href="(/crash_groups/\d+/.+)" ', r.content).group(1)

        # get the crash
        r = requests.get('%s%s' % (self.url, crash_detail_uri), cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        self.assertRegexpMatches(r.content, 'user@gmail.com')

    def test_05_settings_application_update(self):
        """
        update the application
        """
        # get applications
        r = requests.get('%s/settings/applications' % self.url, cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        application_id = re.search('<form id="application(\d+)"', r.content).group(1)

        # update the application -> 200
        r = requests.put('%s/settings/applications/%s' % (self.url, application_id), cookies=self.cookies, data={
            'name': self.application_name,
            'description': 'description'
        })
        self.assertEqual(r.status_code, 200)

        # update the application -> 400
        r = requests.put('%s/settings/applications/aaa' % self.url, cookies=self.cookies, data={
            'name': self.application_name,
            'description': 'description'
        })
        self.assertEqual(r.status_code, 400)

        # update the application -> 417
        r = requests.put('%s/settings/applications/%s' % (self.url, application_id), cookies=self.cookies, data={
            'description': 'description'
        })
        self.assertEqual(r.status_code, 417)

    def test_06_settings_application_invite(self):
        """
        POST: /settings/applications/<application_id>/invite

        invite user join the application
        """
        # get applications
        r = requests.get('%s/settings/applications' % self.url, cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        application_id = re.search('<form id="application(\d+)"', r.content).group(1)

        # invite the user
        r = requests.post('%s/settings/applications/%s/invite' % (self.url, application_id), cookies=self.cookies, data={
            'email': 'invite@phate.org'
        })
        self.assertEqual(r.status_code, 200)

        # get applications
        r = requests.get('%s/settings/applications' % self.url, cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        uri = re.search('<a href="(/settings/applications/\d+/members/\d+)#" class="delete_viewer" ', r.content).group(1)

        # delete the viewer in this application
        r = requests.delete('%s%s' % (self.url, uri), cookies=self.cookies)
        self.assertEqual(r.status_code, 200)

        # get user list
        r = requests.get('%s/settings/users' % self.url, cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        self.assertRegexpMatches(r.content, '.*<td>invite@phate.org</td>.*')

        # delete the user
        user_id = re.search('.*<a href="/settings/users/(\d+)#" class="delete_user">', r.content).group(1)
        r = requests.delete('%s/settings/users/%s' % (self.url, user_id), cookies=self.cookies)
        self.assertEqual(r.status_code, 200)

    def test_07_settings_application_delete(self):
        """
        delete the test application
        """
        # get applications
        r = requests.get('%s/settings/applications' % self.url, cookies=self.cookies)
        self.assertEqual(r.status_code, 200)
        application_id = re.search('<form id="application(\d+)"', r.content).group(1)

        # delete the application -> 400
        r = requests.delete('%s/settings/applications/aa' % self.url, cookies=self.cookies)
        self.assertEqual(r.status_code, 400)

        # delete the application -> 417
        r = requests.delete('%s/settings/applications/11111' % self.url, cookies=self.cookies)
        self.assertEqual(r.status_code, 417)

        # delete the application -> 200
        r = requests.delete('%s/settings/applications/%s' % (self.url, application_id), cookies=self.cookies)
        self.assertEqual(r.status_code, 200)


if __name__ == '__main__':
    unittest.main()