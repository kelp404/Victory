
#
# HTTP Client
# Kelp  http://kelp.phate.org/
# MIT License
#

"""
# example:

from utilites.http_client import HttpClient
import json

# GET:
    # search 'cocoa' with google search api
    # get http://ajax.googleapis.com/ajax/services/search/web?q=cocoa

    client = HttpClient('http://ajax.googleapis.com/')
    result = client.get('ajax/services/search/web', parameters={ 'v': 1.0, 'rsz': 8, 'q': 'cocoa' })
    result.content = json.loads(result.content)
    self.response.headers['Content-Type'] = "text/javascript"
    self.response.out.write(json.dumps(result.__dict__))


# POST:
    # post a picture 'test_http_client_controller.jpg' to google picture search
    # post https://www.google.com/searchbyimage/upload
    # google will return 302 redirect, and the url of the result page is location in the headres

    # read a picture
    path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'test_http_client_controller.jpg'))
    file_data = file(path, 'rb').read()

    # post picture data to google
    client = HttpClient('https://www.google.com/searchbyimage/upload')
    result = client.post(files=[{ 'name': 'encoded_image', 'filename': 'galaxy.jpg', 'data': file_data }])

    self.response.headers['Content-Type'] = "text/javascript"
    self.response.out.write(json.dumps(result.__dict__))
"""


import httplib, mimetypes
from urlparse import urlparse
import urllib2
import json


class HttpClientResponse(object):
    url = ''
    method = ''
    status = 200
    headers = []
    content = ''

    def __init__(self, method, url, status, headers, content):
        self.method = method
        self.url = url
        self.status = status
        self.headers = headers
        self.content = content


class HttpClient(object):
    headers = {
        "Accept-Encoding": "deflate",
        "Accept": "*/*"
    }
    timeout = 10

    __scheme = 'http'
    __host = ''
    __port = 80
    __base_uri = '/'

    @property
    def url(self):
        url = []
        url.append(self.__scheme)
        url.append('://')
        url.append(self.__host)
        if (self.__scheme == 'http' and self.__port != 80) or (self.__scheme == 'https' and self.__port != 443):
            url.append(':')
            url.append(str(self.__port))
        url.append(self.__base_uri)
        return ''.join(url)
    @url.setter
    def url(self, value):
        self.__init__(value)

    # init
    def __init__(self, url=None, headers=None):
        parsed = urlparse(url)

        # check scheme
        if self.__is_none_or_empty(parsed.scheme):
            # no scheme in url, like 'google.com......'
            self.__scheme = 'http'
        else:
            # 'http://google.com....'
            self.__scheme = parsed.scheme

        # check host
        if self.__is_none_or_empty(parsed.netloc):
            # 'google.com'
            self.__host = parsed.path
        else:
            # 'http://google.com.....'
            self.__host = parsed.netloc
            if self.__is_none_or_empty(parsed.path) is False:
                # 'http://google.com/account...'
                self.__base_uri = parsed.path

        # get port
        if self.__scheme == 'http':
            self.__port = 80
        elif self.__scheme == 'https':
            self.__port = 443
        if parsed.port:
            self.__port = parsed.port

        # remove port in host
        if self.__host.find(':') >= 0:
            self.__host = self.__host[:self.__host.find(':')]
        # remove '/' in host
        self.__host = self.__host.replace('/', '')

        # update default headers
        if headers is not None:
            self.headers.update(headers)


    # public method -------------------------------------------
    # HTTP GET
    # parameters = { 'q': 'cocoa', 'language': 'english' }
    def get(self, uri='', parameters=None):
        client = self.__get_client(self.__scheme)

        if parameters is not None and len(parameters) > 0:
            parms = []
            for key in parameters:
                parms.append('%s=%s' % (key, urllib2.quote(str(parameters[key]))))
            parmstr = '&'.join(parms)
            request_uri = '%s?%s' % (self.__uri_append(self.__base_uri, uri), parmstr)
            request_url = '%s?%s' % (self.__uri_append(self.url, uri), parmstr)
        else:
            request_uri = self.__uri_append(self.__base_uri, uri)
            request_url = self.__uri_append(self.url, uri)

        client.request("GET", request_uri, headers=self.headers)
        http_response = client.getresponse()
        response = HttpClientResponse('get', request_url, http_response.status, http_response.getheaders(), http_response.read())
        http_response.close()
        return response

    # HTTP POST
    # parameters = { 'q': 'cocoa', 'language': 'english' }
    # files = [
    #               { 'name': 'input name', 'filename': 'a.jpg', 'data': 'binary data' },
    #               { 'name': 'icon', 'filename': 'icon.jpg', 'data': '\xff\xac....' }
    #           ]
    def post(self, uri='', parameters=None, files=None, use_json=False):
        return self.__send_request('post', uri, parameters, files, use_json)

    # HTTP PUT
    # parameters = { 'q': 'cocoa', 'language': 'english' }
    # files = [
    #               { 'name': 'input name', 'filename': 'a.jpg', 'data': 'binary data' },
    #               { 'name': 'icon', 'filename': 'icon.jpg', 'data': '\xff\xac....' }
    #           ]
    def put(self, uri='', parameters=None, files=None, use_json=False):
        return self.__send_request('put', uri, parameters, files, use_json)

    # HTTP DELETE
    # parameters = { 'q': 'cocoa', 'language': 'english' }
    # files = [
    #               { 'name': 'input name', 'filename': 'a.jpg', 'data': 'binary data' },
    #               { 'name': 'icon', 'filename': 'icon.jpg', 'data': '\xff\xac....' }
    #           ]
    def delete(self, uri='', parameters=None, files=None, use_json=False):
        return self.__send_request('delete', uri, parameters, files, use_json)


    # private method ------------------------------------------
    # get http / https client
    def __get_client(self, scheme):
        if scheme == 'https':
            return httplib.HTTPSConnection(host=self.__host, port=self.__port, timeout=self.timeout)
        else:
            return httplib.HTTPConnection(host=self.__host, port=self.__port, timeout=self.timeout)

    # send request
    # parameters = { 'q': 'cocoa', 'language': 'english' }
    # files = [
    #               { 'name': 'input name', 'filename': 'a.jpg', 'data': 'binary data' },
    #               { 'name': 'icon', 'filename': 'icon.jpg', 'data': '\xff\xac....' }
    #           ]
    def __send_request(self, method, uri='', parameters=None, files=None, use_json=False):
        client = self.__get_client(self.__scheme)
        request_uri = self.__uri_append(self.__base_uri, uri)
        request_url = self.__uri_append(self.url, uri)
        headers = self.headers.copy()

        # application/x-www-form-urlencoded
        if parameters is not None and files is None and use_json is False:
            headers['Content-Type'] = 'application/x-www-form-urlencoded'
            if parameters is not None and len(parameters) > 0:
                parms = []
                for key in parameters:
                    if parameters[key] is None:
                        parms.append('%s=' % key)
                    else:
                        import logging
                        parms.append('%s=%s' % (key, urllib2.quote(str(parameters[key].encode('utf-8')))))
                body = '&'.join(parms)
            else:
                body = ''

        # application/json
        elif use_json and parameters is not None:
            headers['Content-Type'] = 'application/json'
            body = json.dumps(parameters)

        # multipart/form-data
        elif files is not None:
            content_type, body = self.__encode_multipart_formdata(parameters, files)
            headers['Content-Type'] = content_type

        # i have no idea
        else:
            headers['Content-Type'] = 'application/x-www-form-urlencoded'
            body = ''

        client.request(method.upper(), request_uri, body=body, headers=headers)
        http_response = client.getresponse()
        response = HttpClientResponse(method, request_url, http_response.status, http_response.getheaders(), http_response.read())
        http_response.close()
        return response

    # gen boundary data
    def __encode_multipart_formdata(self, fields, files):
        boundary = '----PythonHttpClientFormBoundaryKelp'
        binary = bytearray(b'')
        if fields is not None:
            for key in fields:
                binary.extend('--%s\n' % boundary)
                binary.extend('Content-Disposition: form-data; name="%s"\n\n' % key)
                binary.extend('%s\n' % str(fields[key]))
        if files is not None:
            for item in files:
                binary.extend('--%s\n' % boundary)
                binary.extend('Content-Disposition: form-data; name="%s"; filename="%s"\n' % (item['name'], item['filename']))
                binary.extend('Content-Type: %s\n\n' % self.__get_content_type(item['filename']))
                binary.extend(str(item['data']))
                binary.extend('\n')
        binary.extend('--%s--\n' % boundary)

        content_type = 'multipart/form-data; boundary=%s' % boundary
        return content_type, str(binary)

    # get content type for file name
    def __get_content_type(self, filename):
        return mimetypes.guess_type(filename)[0] or 'application/octet-stream'

    # uri append
    def __uri_append(self, uri1, uri2):
        count = 0
        if uri1.rfind('/') == len(uri1) - 1:
            count += 1
        if uri2.find('/') == 0:
            count += 1
        if len(uri2) == 0:
            count = 1

        if count == 0:
            return '%s/%s' % (uri1, uri2)
        elif count == 1:
            return '%s%s' % (uri1, uri2)
        elif count > 1:
            return '%s%s' % (uri1[:len(uri1) - 1], uri2)

    # if string is none or empty then return True
    def __is_none_or_empty(self, str):
        if str is None or str == '':
            return True
        else:
            return False
