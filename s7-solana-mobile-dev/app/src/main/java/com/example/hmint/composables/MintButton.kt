package com.example.hmint.composables

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.os.Looper
import android.net.Uri
import android.widget.Toast
import androidx.activity.compose.ManagedActivityResultLauncher
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.hmint.BuildConfig
import com.example.hmint.MainViewModel
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationSettingsRequest
import com.google.android.gms.tasks.Task
import java.io.File

@Composable
fun MintButton(
    mainViewModel: MainViewModel = hiltViewModel()
) {
    val context = LocalContext.current

    var capturedImageUri by remember {
        mutableStateOf<Uri>(Uri.EMPTY)
    }

    var latitude by remember { mutableStateOf<Double?>(null) }
    var longitude by remember { mutableStateOf<Double?>(null) }

    val viewState = mainViewModel.viewState.collectAsState().value

    // Camera launcher for capturing an image
    val cameraLauncher =
        rememberLauncherForActivityResult(ActivityResultContracts.TakePicture()) { success ->
            if (success && capturedImageUri != Uri.EMPTY && latitude != null && longitude != null) {
                mainViewModel.mintCNft(capturedImageUri, "mint", viewState.userAddress, latitude!!, longitude!!)
            } else {
                Toast.makeText(context, "Failed to capture image or location", Toast.LENGTH_SHORT).show()
            }
        }

    // Permission launcher for requesting camera permission
    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) {
            Toast.makeText(context, "Permission Granted", Toast.LENGTH_SHORT).show()
            launchCamera(context, cameraLauncher, capturedImageUriSetter = { capturedImageUri = it }) // Launch camera with permission
        } else {
            Toast.makeText(context, "Permission Denied", Toast.LENGTH_SHORT).show()
        }
    }

    // Permission launcher for requesting location permission
    val locationPermissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) {
            getLastLocation(context) { lat, lon ->
                latitude = lat
                longitude = lon
                // Proceed to capture image
                val permissionCheckResult =
                    ContextCompat.checkSelfPermission(
                        context,
                        Manifest.permission.CAMERA
                    )
                if (permissionCheckResult == PackageManager.PERMISSION_GRANTED) {
                    launchCamera(context, cameraLauncher, capturedImageUriSetter = { capturedImageUri = it }) // Use helper function to launch the camera
                } else {
                    // Request camera permission
                    permissionLauncher.launch(Manifest.permission.CAMERA)
                }
            }
        } else {
            Toast.makeText(context, "Location Permission Denied", Toast.LENGTH_SHORT).show()
        }
    }

    // Display the toast message if it's not null
    viewState.mintResponse.let { message ->
        if (message.isNotEmpty()) {
            Toast.makeText(LocalContext.current, message, Toast.LENGTH_SHORT).show()
        }
    }

    Column(
        Modifier
            .padding(10.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        if (viewState.isLoading) {
            CircularProgressIndicator(
                color = Color.Red,
                strokeWidth = 4.dp
            )
            Spacer(Modifier.size(5.dp))
            Text("Please wait, while we mint the NFT", style = MaterialTheme.typography.labelMedium)
        } else {
            Text("NFTs on the go", style = MaterialTheme.typography.titleLarge)
            if (!viewState.canTransact) {
                Text("Connect your wallet first", style = MaterialTheme.typography.labelMedium)
            } else {
                Text("Capture an image and we mint the NFT for you", style = MaterialTheme.typography.labelMedium)
            }
            Spacer(Modifier.size(8.dp))
            Button(
                onClick = {
                    val locationPermissionCheckResult =
                        ContextCompat.checkSelfPermission(
                            context,
                            Manifest.permission.ACCESS_FINE_LOCATION
                        )
                    if (locationPermissionCheckResult == PackageManager.PERMISSION_GRANTED) {
                        // Location permission granted
                        getLastLocation(context) { lat, lon ->
                            latitude = lat
                            longitude = lon
                            // Proceed to capture image
                            val permissionCheckResult =
                                ContextCompat.checkSelfPermission(
                                    context,
                                    Manifest.permission.CAMERA
                                )
                            if (permissionCheckResult == PackageManager.PERMISSION_GRANTED) {
                                launchCamera(context, cameraLauncher, capturedImageUriSetter = { capturedImageUri = it })
                            } else {
                                permissionLauncher.launch(Manifest.permission.CAMERA)
                            }
                        }
                    } else {
                        // Request location permission
                        locationPermissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
                    }
                },
                enabled = viewState.canTransact
            ) {
                Text(text = "Take a picture")
            }
        }
    }
}

fun Context.createImageFile(): File {
    val imageFileName = "test"
    return File.createTempFile(
        imageFileName, /* prefix */
        ".jpg", /* suffix */
        externalCacheDir      /* directory */
    )
}

private fun launchCamera(
    context: Context,
    cameraLauncher: ManagedActivityResultLauncher<Uri, Boolean>,
    capturedImageUriSetter: (Uri) -> Unit
) {
    val file = context.createImageFile()
    val uri = FileProvider.getUriForFile(
        context,
        BuildConfig.APPLICATION_ID + ".provider",
        file
    )
    capturedImageUriSetter(uri) // Set the Uri to the state variable
    cameraLauncher.launch(uri)
}

private fun getLastLocation(context: Context, onLocationReceived: (Double, Double) -> Unit) {
    val fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)
    val locationPermissionCheckResult =
        ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION)

    if (locationPermissionCheckResult == PackageManager.PERMISSION_GRANTED) {
        fusedLocationClient.lastLocation
            .addOnSuccessListener { location: Location? ->
                if (location != null) {
                    onLocationReceived(location.latitude, location.longitude)
                } else {
                    Toast.makeText(context, "Failed to get location", Toast.LENGTH_SHORT).show()
                }
            }
            .addOnFailureListener {
                Toast.makeText(context, "Error getting location", Toast.LENGTH_SHORT).show()
            }
    } else {
        Toast.makeText(context, "Location permission not granted", Toast.LENGTH_SHORT).show()
    }
}
