from google.oauth2 import service_account
import googleapiclient.discovery


def verify_purchase(data):
    token = data.get('purchaseToken')
    package_name = data.get('packageName')
    product_id = data.get('productId')

    credentials = service_account.Credentials.from_service_account_file("google-service.json")

    # Build the "service" interface to the API you want
    service = googleapiclient.discovery.build("androidpublisher", "v3", credentials=credentials)

    # Use the token your API got from the app to verify the purchase
    products = service.purchases().products()
    result = products.get(packageName=package_name,
                          productId=product_id,
                          token=token).execute()
    print(result)
