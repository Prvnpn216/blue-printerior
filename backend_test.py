#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class InteriorDesignAPITester:
    def __init__(self, base_url="https://design-portfolio-412.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_result(self, test_name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}")
        if details:
            print(f"    Details: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f" (Expected: {expected_status})"
                try:
                    error_data = response.json()
                    details += f", Response: {error_data}"
                except:
                    details += f", Response: {response.text[:200]}"
            
            self.log_result(name, success, details)
            
            if success:
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                return False, {}

        except Exception as e:
            self.log_result(name, False, f"Error: {str(e)}")
            return False, {}

    def test_admin_auth(self):
        """Test admin authentication"""
        print("\n🔐 Testing Admin Authentication...")
        
        # Test registration
        test_username = f"testadmin_{datetime.now().strftime('%H%M%S')}"
        test_password = "TestPass123!"
        
        success, response = self.run_test(
            "Admin Registration",
            "POST",
            "auth/register",
            200,
            data={"username": test_username, "password": test_password}
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            
            # Test login with same credentials
            success, response = self.run_test(
                "Admin Login",
                "POST", 
                "auth/login",
                200,
                data={"username": test_username, "password": test_password}
            )
            
            if success and 'access_token' in response:
                return True
        
        return False

    def test_projects_crud(self):
        """Test project CRUD operations"""
        print("\n📁 Testing Project CRUD Operations...")
        
        # Test get projects (empty initially)
        self.run_test("Get All Projects", "GET", "projects", 200)
        
        # Test get featured projects
        self.run_test("Get Featured Projects", "GET", "projects?featured=true", 200)
        
        # Create a test project
        project_data = {
            "title": "Test Luxury Living Room",
            "description": "A beautiful modern living room with elegant furniture and lighting",
            "category": "Residential",
            "featured": True,
            "images": [
                {
                    "url": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=85&w=800",
                    "hotspots": []
                }
            ]
        }
        
        success, response = self.run_test(
            "Create Project",
            "POST",
            "projects",
            200,
            data=project_data
        )
        
        if success and 'id' in response:
            project_id = response['id']
            
            # Test get specific project
            self.run_test(
                "Get Project by ID",
                "GET",
                f"projects/{project_id}",
                200
            )
            
            # Test update project
            updated_data = project_data.copy()
            updated_data['title'] = "Updated Luxury Living Room"
            updated_data['featured'] = False
            
            self.run_test(
                "Update Project",
                "PUT",
                f"projects/{project_id}",
                200,
                data=updated_data
            )
            
            # Test delete project
            self.run_test(
                "Delete Project",
                "DELETE",
                f"projects/{project_id}",
                200
            )
            
            return True
        
        return False

    def test_products_crud(self):
        """Test product CRUD operations"""
        print("\n🛋️ Testing Product CRUD Operations...")
        
        # Test get products (empty initially)
        self.run_test("Get All Products", "GET", "products", 200)
        
        # Create a test product
        product_data = {
            "name": "Modern Leather Sofa",
            "description": "Premium Italian leather sofa with contemporary design",
            "price": 2500.00,
            "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=85&w=800",
            "category": "Furniture",
            "in_stock": True
        }
        
        success, response = self.run_test(
            "Create Product",
            "POST",
            "products",
            200,
            data=product_data
        )
        
        if success and 'id' in response:
            product_id = response['id']
            
            # Test get specific product
            self.run_test(
                "Get Product by ID",
                "GET",
                f"products/{product_id}",
                200
            )
            
            # Test update product
            updated_data = product_data.copy()
            updated_data['price'] = 2800.00
            updated_data['in_stock'] = False
            
            self.run_test(
                "Update Product",
                "PUT",
                f"products/{product_id}",
                200,
                data=updated_data
            )
            
            # Test delete product
            self.run_test(
                "Delete Product",
                "DELETE",
                f"products/{product_id}",
                200
            )
            
            return True
        
        return False

    def test_inquiries(self):
        """Test inquiry operations"""
        print("\n📧 Testing Inquiry Operations...")
        
        # Create a test product first for inquiry
        product_data = {
            "name": "Test Chair",
            "description": "Test chair for inquiry",
            "price": 500.00,
            "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=85&w=800",
            "category": "Furniture",
            "in_stock": True
        }
        
        success, response = self.run_test(
            "Create Product for Inquiry Test",
            "POST",
            "products",
            200,
            data=product_data
        )
        
        if success and 'id' in response:
            product_id = response['id']
            
            # Create inquiry (no auth required)
            inquiry_data = {
                "name": "John Doe",
                "email": "john.doe@example.com",
                "phone": "+1234567890",
                "product_id": product_id,
                "product_name": "Test Chair",
                "message": "I'm interested in this chair. Can you provide more details?"
            }
            
            # Test without auth (should work)
            temp_token = self.token
            self.token = None
            
            success, response = self.run_test(
                "Create Inquiry (No Auth)",
                "POST",
                "inquiries",
                200,
                data=inquiry_data
            )
            
            # Restore token
            self.token = temp_token
            
            # Test get inquiries (requires auth)
            self.run_test(
                "Get All Inquiries (Auth Required)",
                "GET",
                "inquiries",
                200
            )
            
            # Clean up - delete test product
            self.run_test(
                "Delete Test Product",
                "DELETE",
                f"products/{product_id}",
                200
            )
            
            return True
        
        return False

    def test_image_upload(self):
        """Test image upload functionality"""
        print("\n🖼️ Testing Image Upload...")
        
        # Create a simple test image data (base64 encoded 1x1 pixel)
        import base64
        
        # Create minimal test file data
        test_file_content = b"test image content"
        
        try:
            # Test upload without proper multipart (should fail gracefully)
            self.run_test(
                "Image Upload Test",
                "POST",
                "upload-image",
                422  # Expecting validation error for missing file
            )
            return True
        except:
            return False

    def test_error_cases(self):
        """Test error handling"""
        print("\n⚠️ Testing Error Cases...")
        
        # Test non-existent project
        self.run_test(
            "Get Non-existent Project",
            "GET",
            "projects/non-existent-id",
            404
        )
        
        # Test non-existent product
        self.run_test(
            "Get Non-existent Product",
            "GET",
            "products/non-existent-id",
            404
        )
        
        # Test unauthorized access
        temp_token = self.token
        self.token = None
        
        self.run_test(
            "Unauthorized Project Creation",
            "POST",
            "projects",
            401,
            data={"title": "Test", "description": "Test", "category": "Test"}
        )
        
        self.token = temp_token
        
        # Test invalid login
        self.run_test(
            "Invalid Login Credentials",
            "POST",
            "auth/login",
            401,
            data={"username": "invalid", "password": "invalid"}
        )
        
        return True

    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Interior Design Portfolio API Tests")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test authentication first
        if not self.test_admin_auth():
            print("❌ Authentication failed - stopping tests")
            return False
        
        # Run all test suites
        self.test_projects_crud()
        self.test_products_crud()
        self.test_inquiries()
        self.test_image_upload()
        self.test_error_cases()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️ {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = InteriorDesignAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/test_reports/backend_test_results.json', 'w') as f:
        json.dump({
            'summary': {
                'total_tests': tester.tests_run,
                'passed_tests': tester.tests_passed,
                'success_rate': (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0,
                'timestamp': datetime.now().isoformat()
            },
            'detailed_results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())